"""
Decision Service – orchestrates inventory + slider → Gemini → validated scenarios.
"""
import json
import logging
from datetime import datetime, timezone
from typing import Any, Dict, List

from services.bigquery_service import bigquery_service
from services.gemini_service import gemini_service
from prompts.scenario_prompt import build_scenario_prompt
from utils.validators import validate_scenarios

logger = logging.getLogger(__name__)


def _rule_based_scenarios(inventory: List[Dict], priority: int) -> List[Dict[str, Any]]:
    """
    Pure-Python fallback when Gemini is unavailable.
    Computes order suggestions from stock + weekly sales ratios.
    """
    # Demand multipliers based on priority
    conservative_mult = 0.7
    aggressive_mult = 1.4
    ai_mult = 0.7 + (priority / 100) * 0.7  # interpolate between 0.7 and 1.4

    def build_order(mult: float) -> Dict[str, int]:
        return {
            item["product_name"]: max(0, round((item["avg_weekly_sales_units"] - item["current_stock_units"]) * mult))
            for item in inventory
        }

    def est_profit(mult: float) -> str:
        total = sum(
            max(0, round((i["avg_weekly_sales_units"] - i["current_stock_units"]) * mult))
            * (i["unit_price"] - i["unit_cost"])
            for i in inventory
        )
        return f"${total:.2f}"

    def est_waste(mult: float) -> str:
        pct = max(5, 30 - round(priority * 0.2)) if mult < 1.0 else round(10 + priority * 0.15)
        return f"~{pct}% of ordered stock"

    # Scores: higher priority = profit weighted; lower = waste weighted
    profit_weight = priority / 100
    waste_weight = 1 - profit_weight

    scores = {
        "Conservative": round(waste_weight * 90 + profit_weight * 40, 1),
        "Aggressive":   round(waste_weight * 30 + profit_weight * 95, 1),
        "AI Recommended": round(waste_weight * 70 + profit_weight * 75, 1),
    }

    scenarios_raw = [
        {
            "name": "Conservative",
            "score": scores["Conservative"],
            "suggested_order": build_order(conservative_mult),
            "estimated_profit": est_profit(conservative_mult),
            "estimated_waste": est_waste(conservative_mult),
            "benefits": [
                "Minimises spoilage and markdown losses",
                "Reduces over-ordering risk",
                "Lower upfront capital tied up in stock",
            ],
            "risks": [
                "May run out of stock on high-demand items",
                "Missed sales opportunity if event drives demand",
                "Lower revenue ceiling",
            ],
        },
        {
            "name": "Aggressive",
            "score": scores["Aggressive"],
            "suggested_order": build_order(aggressive_mult),
            "estimated_profit": est_profit(aggressive_mult),
            "estimated_waste": est_waste(aggressive_mult),
            "benefits": [
                "Maximises revenue during high-demand events",
                "Prevents stockouts on popular lines",
                "Capitalises on local event foot traffic",
            ],
            "risks": [
                "Higher waste if demand forecast is wrong",
                "Elevated working capital requirement",
                "Short-shelf-life items may not sell through",
            ],
        },
        {
            "name": "AI Recommended",
            "score": scores["AI Recommended"],
            "suggested_order": build_order(ai_mult),
            "estimated_profit": est_profit(ai_mult),
            "estimated_waste": est_waste(ai_mult),
            "benefits": [
                "Balances profit and waste at your chosen priority",
                "Boosts high-sensitivity items for weather/event",
                "Calibrated to current stock and shelf-life data",
            ],
            "risks": [
                "Mid-range approach means neither extreme is optimised",
                "Dependent on accuracy of sales history data",
            ],
        },
    ]

    # Rank by score descending
    scenarios_raw.sort(key=lambda s: s["score"], reverse=True)
    for i, s in enumerate(scenarios_raw, 1):
        s["rank"] = i

    return scenarios_raw


class DecisionService:
    """
    Reads slider value + inventory, builds Gemini prompt,
    validates output, returns ranked scenarios.
    """

    def generate_scenarios(self, priority: int) -> Dict[str, Any]:
        inventory = bigquery_service.get_inventory()

        try:
            prompt = build_scenario_prompt(inventory, priority)
            raw = gemini_service.generate(prompt)
            scenarios = validate_scenarios(raw.get("scenarios", raw))
        except Exception as exc:
            logger.warning("Gemini unavailable (%s) – using rule-based fallback.", exc)
            scenarios = _rule_based_scenarios(inventory, priority)

        return {
            "scenarios": scenarios,
            "priority": priority,
            "generated_at": datetime.now(timezone.utc).isoformat(),
        }


decision_service = DecisionService()
