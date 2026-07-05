"""
Explanation prompt for Gemini.
Builds a prompt that returns a plain-English explanation of WHY a scenario is recommended,
grounded entirely in the inventory data.
"""
import json
from typing import List, Dict, Any


def build_explanation_prompt(
    inventory: List[Dict[str, Any]],
    scenario_name: str,
    priority: int,
) -> str:
    """
    Constructs the Gemini prompt for explaining the chosen scenario.

    Args:
        inventory:     List of inventory row dicts from BigQuery.
        scenario_name: Name of the scenario to explain.
        priority:      0–100 slider value.
    """
    inventory_json = json.dumps(inventory, indent=2)

    bias_label = (
        "waste reduction" if priority < 40
        else "profit" if priority > 60
        else "a balanced trade-off"
    )

    prompt = f"""You are an AI advisor explaining inventory decisions to a small grocery store owner.

## Task
Explain in clear, friendly plain English WHY the "{scenario_name}" purchasing strategy
is the best choice given the owner's current priority setting and inventory data.

## Priority Setting
{priority} / 100 — the owner is prioritising {bias_label}.

## Inventory Data
{inventory_json}

## Rules — STRICTLY ENFORCED
1. Every number or statistic you mention MUST come directly from the inventory data above.
2. Never invent percentages, dollar amounts, or quantities not present in the data.
3. Reference specific column values: avg_weekly_sales_units, current_stock_units,
   shelf_life_days, unit_cost, unit_price, weather_sensitivity, local_event_flag.
4. Write for a non-technical reader — avoid jargon.
5. Keep the response to 4–6 short paragraphs.
6. Do NOT include JSON, bullet lists, or markdown headers — only flowing prose.
7. Start by naming the strategy and connecting it to the owner's priority setting.
8. Then walk through 2–3 specific products from the data to illustrate why the
   quantities are right (cite shelf_life_days, avg_weekly_sales_units, etc.).
9. Close with one sentence on the expected outcome.

Write the explanation now:
"""
    return prompt
