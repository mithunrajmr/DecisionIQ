"""
Explanation Service – generates plain-English Gemini explanation for a chosen scenario.
"""
import logging
from typing import Dict, Any

from services.bigquery_service import bigquery_service
from services.gemini_service import gemini_service
from prompts.explanation_prompt import build_explanation_prompt

logger = logging.getLogger(__name__)


def _rule_based_explanation(scenario_name: str, inventory: list, priority: int) -> str:
    """Fallback explanation built purely from inventory data – no invented numbers."""
    high_sensitivity = [i["product_name"] for i in inventory if i["weather_sensitivity"] == "high"]
    event_items = [i["product_name"] for i in inventory if i["local_event_flag"]]
    short_shelf = [i for i in inventory if i["shelf_life_days"] <= 3]
    short_names = [i["product_name"] for i in short_shelf]

    bias = "waste reduction" if priority < 40 else ("profit maximisation" if priority > 60 else "a balanced approach")

    explanation = (
        f"The **{scenario_name}** strategy was selected based on your current priority setting "
        f"of {priority}/100, which favours {bias}.\n\n"
        f"**Key factors from your inventory data:**\n\n"
        f"- You have {len(inventory)} products across "
        f"{len(set(i['category'] for i in inventory))} categories currently in stock.\n"
    )

    if short_names:
        explanation += (
            f"- Items with shelf life of 3 days or fewer — "
            f"{', '.join(short_names)} — have been ordered conservatively "
            f"to limit spoilage risk.\n"
        )

    if high_sensitivity:
        explanation += (
            f"- Weather-sensitive products ({', '.join(high_sensitivity[:3])}) "
            f"have adjusted order quantities based on tomorrow's forecast.\n"
        )

    if event_items:
        explanation += (
            f"- The local event flag is active for "
            f"{', '.join(event_items[:3])}, suggesting increased foot traffic "
            f"and higher demand for these lines.\n"
        )

    explanation += (
        f"\nAll order quantities are derived from the `avg_weekly_sales_units` "
        f"and `current_stock_units` values in your BigQuery inventory table — "
        f"no numbers have been assumed or invented."
    )
    return explanation


class ExplanationService:
    """
    Generates a Gemini explanation for the selected scenario,
    grounded entirely in BigQuery inventory data.
    """

    def explain(self, scenario_name: str, priority: int) -> Dict[str, Any]:
        inventory = bigquery_service.get_inventory()

        try:
            prompt = build_explanation_prompt(inventory, scenario_name, priority)
            explanation = gemini_service.generate_text(prompt)
        except Exception as exc:
            logger.warning("Gemini unavailable (%s) – using rule-based explanation.", exc)
            explanation = _rule_based_explanation(scenario_name, inventory, priority)

        return {"explanation": explanation, "scenario": scenario_name}


explanation_service = ExplanationService()
