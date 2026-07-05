"""
Explanation Service – generates structured Gemini explanations and suggested actions
grounded in inventory data, with a clean rule-based fallback.
"""
import logging
from typing import Dict, Any, List

from services.bigquery_service import bigquery_service
from services.gemini_service   import gemini_service
from prompts.explanation_prompt import build_explanation_prompt

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Rule-based fallback builders (used when Gemini fails/is not configured)
# ---------------------------------------------------------------------------

def _rule_based_fallback(scenario_name: str, inventory: list, priority: int) -> Dict[str, Any]:
    """
    Computes structured explanation sections and actions purely from data.
    """
    high_sensitivity = [i["product_name"] for i in inventory if i["weather_sensitivity"] == "high"]
    event_items      = [i["product_name"] for i in inventory if i["local_event_flag"]]
    short_shelf      = [i for i in inventory if i["shelf_life_days"] <= 3]
    short_names      = [i["product_name"] for i in short_shelf]

    bias = (
        "waste reduction" if priority < 40
        else "profit maximisation" if priority > 60
        else "balanced risk trade-off"
    )

    why_this_strategy = (
        f"The {scenario_name} purchasing strategy aligns with your choice of {priority}/100 priority, "
        f"placing key business focus on {bias}."
    )

    factors_list = [
        f"Total of {len(inventory)} products in catalog."
    ]
    if short_names:
        factors_list.append(f"Short shelf-life items ({', '.join(short_names[:3])}) were ordered conservatively to limit spoilage risk.")
    if high_sensitivity:
        factors_list.append(f"Weather sensitivity markers on {', '.join(high_sensitivity[:2])} adjusted stock levels.")
    if event_items:
        factors_list.append(f"Local event traffic flags enabled on {', '.join(event_items[:2])} to capture extra sales.")

    key_inventory_factors = " ".join(factors_list)

    business_impact = (
        f"This strategy aims to capture optimal grocery sales velocity "
        f"while protecting store margins against unnecessary discard write-offs."
    )

    risks = (
        f"Under this layout, short-shelf items pose potential spoilage risks if demand underperforms, "
        f"while leaner margins may lead to brief out-of-stock items if customer turnout spikes."
    )

    # Re-use our solid rule-based suggested actions generator
    actions = []
    if event_items:
        critical = max(inventory, key=lambda i: i["avg_weekly_sales_units"] - i["current_stock_units"])
        actions.append({
            "action": f"Increase {critical['product_name']} order ahead of the local event.",
            "product": critical["product_name"],
            "reason": f"Current stock is below weekly average sales and event foot traffic is active."
        })
    if short_shelf:
        item = min(short_shelf, key=lambda i: i["shelf_life_days"])
        actions.append({
            "action": f"Delay bulk {item['product_name']} purchase until closer to delivery date.",
            "product": item["product_name"],
            "reason": f"{item['product_name']} has a shelf life of only {item['shelf_life_days']} days."
        })
    if high_sensitivity:
        top_weather = max(high_sensitivity)
        actions.append({
            "action": f"Monitor {top_weather} sales closely — adjust reorder dynamically.",
            "product": top_weather,
            "reason": "This line is marked as weather-sensitive; check forecast tomorrow."
        })

    while len(actions) < 3:
        actions.append({
            "action": "Calibrate stock targets against weekly average numbers.",
            "product": None,
            "reason": "Tracking actual turnout rates helps keep store targets aligned."
        })

    return {
        "why_this_strategy": why_this_strategy,
        "key_inventory_factors": key_inventory_factors,
        "business_impact": business_impact,
        "risks": risks,
        "suggested_actions": actions[:3],
    }


# ---------------------------------------------------------------------------
# Service Class
# ---------------------------------------------------------------------------

class ExplanationService:
    """
    Generates a structured Gemini explanation containing four distinct categories
    and 3 specific next actions grounded in BigQuery data.
    """

    def explain(self, scenario_name: str, priority: int) -> Dict[str, Any]:
        inventory = bigquery_service.get_inventory()

        try:
            prompt = build_explanation_prompt(inventory, scenario_name, priority)
            # Call gemini_service.generate() to parse the JSON output from Gemini
            raw = gemini_service.generate(prompt)

            # Ensure all required fields exist in the JSON response
            result = {
                "why_this_strategy":     str(raw.get("why_this_strategy", "")),
                "key_inventory_factors": str(raw.get("key_inventory_factors", "")),
                "business_impact":       str(raw.get("business_impact", "")),
                "risks":                 str(raw.get("risks", "")),
                "suggested_actions":     list(raw.get("suggested_actions", [])),
            }
            logger.info("Serving explanation and suggested actions from Gemini API.")
            print("[DecisionIQ] Serving explanation and suggested actions from Gemini API.")
        except Exception as exc:
            logger.warning("Gemini explanation query failed (%s). Serving explanation from fallback.", exc)
            print(f"[DecisionIQ] Gemini explanation failed ({exc}). Serving explanation from fallback.")
            result = _rule_based_fallback(scenario_name, inventory, priority)

        # Grounding safety checks: ensure actions format matches SuggestedAction schema
        sanitized_actions = []
        for a in result.get("suggested_actions", []):
            if not isinstance(a, dict):
                continue
            sanitized_actions.append({
                "action":  str(a.get("action", "Review inventory metrics.")),
                "product": a.get("product") if a.get("product") else None,
                "reason":  str(a.get("reason", "Based on current BigQuery targets.")),
            })
        result["suggested_actions"] = sanitized_actions
        result["scenario"] = scenario_name

        return result


explanation_service = ExplanationService()
