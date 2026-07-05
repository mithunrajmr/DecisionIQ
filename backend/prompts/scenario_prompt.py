"""
Scenario generation prompt for Gemini.
Builds a structured prompt that returns exactly 3 ranked scenarios as JSON.
"""
import json
from typing import List, Dict, Any


def build_scenario_prompt(inventory: List[Dict[str, Any]], priority: int) -> str:
    """
    Constructs the Gemini prompt for generating Conservative, Aggressive,
    and AI Recommended purchasing scenarios.

    Args:
        inventory: List of inventory row dicts from BigQuery.
        priority:  0 = max waste reduction, 100 = max profit.
    """
    bias_label = (
        "maximum waste reduction (minimise spoilage)"
        if priority <= 20
        else "maximum profit (accept higher waste risk)"
        if priority >= 80
        else f"balanced trade-off (priority score {priority}/100 slightly favouring "
             + ("waste reduction" if priority < 50 else "profit")
             + ")"
    )

    inventory_json = json.dumps(inventory, indent=2)

    prompt = f"""You are an AI inventory decision engine for a small grocery store.

## Task
Generate exactly 3 purchasing scenarios based on the inventory data and priority slider below.
Return ONLY valid JSON — no markdown, no explanation outside the JSON.

## Priority Slider
Value: {priority} / 100
Interpretation: {bias_label}
(0 = care only about waste reduction; 100 = care only about profit)

## Inventory Data
{inventory_json}

## Instructions
For each scenario:
1. **Conservative** – order the minimum needed to avoid stockouts; protect margin by avoiding waste.
2. **Aggressive** – order maximum to capitalise on demand; accept higher waste risk for revenue upside.
3. **AI Recommended** – the best balanced choice given the priority slider value, weather sensitivity,
   shelf life, local event flag, and current stock levels.

Rules:
- All numerical values in estimated_profit and estimated_waste MUST be derived mathematically
  from unit_cost, unit_price, avg_weekly_sales_units, current_stock_units, and shelf_life_days.
- Never invent numbers that don't trace back to the provided inventory data.
- suggested_order maps product_name → units_to_order (integer, ≥ 0).
- score is a float 0–100 reflecting fit to the priority slider.
- rank the scenarios 1 (best fit to priority) → 3 (worst fit).
- benefits and risks are concise plain-language bullet strings.
- estimated_profit format: "$XX.XX range" or "$XX – $YY"
- estimated_waste format: "~X% of ordered stock" or "X–Y units"

## Response Format
{{
  "scenarios": [
    {{
      "name": "Conservative",
      "rank": <int>,
      "score": <float>,
      "suggested_order": {{ "<product_name>": <units>, ... }},
      "estimated_profit": "<string>",
      "estimated_waste": "<string>",
      "benefits": ["<string>", ...],
      "risks": ["<string>", ...]
    }},
    {{
      "name": "Aggressive",
      "rank": <int>,
      "score": <float>,
      "suggested_order": {{ "<product_name>": <units>, ... }},
      "estimated_profit": "<string>",
      "estimated_waste": "<string>",
      "benefits": ["<string>", ...],
      "risks": ["<string>", ...]
    }},
    {{
      "name": "AI Recommended",
      "rank": <int>,
      "score": <float>,
      "suggested_order": {{ "<product_name>": <units>, ... }},
      "estimated_profit": "<string>",
      "estimated_waste": "<string>",
      "benefits": ["<string>", ...],
      "risks": ["<string>", ...]
    }}
  ]
}}
"""
    return prompt
