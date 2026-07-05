"""
Explanation prompt builder for Gemini.
Generates structured JSON explanations and grounding suggestions.
"""
import json
from typing import List, Dict, Any


def build_explanation_prompt(
    inventory: List[Dict[str, Any]],
    scenario_name: str,
    priority: int,
) -> str:
    """
    Constructs the Gemini prompt for structured explanation and suggested actions.
    """
    inventory_json = json.dumps(inventory, indent=2)

    bias_label = (
        "waste reduction (prevent spoilage)" if priority < 40
        else "profit maximization (prevent stockouts)" if priority > 60
        else "a balanced compromise between profit and waste"
    )

    prompt = f"""You are an expert retail decision engine explaining inventory decisions.

## Task
Analyze the provided inventory data and generate a structured decision intelligence analysis and exactly 3 suggested actions for the selected scenario "{scenario_name}" at priority setting {priority}/100.

Return ONLY a valid JSON object matching the schema below. Do not wrap in markdown or add notes.

## Input Context
- Selected Strategy: {scenario_name}
- Slider Priority: {priority} / 100 ({bias_label})
- Inventory Data (BigQuery):
{inventory_json}

## Guidelines for Response Fields
1. **why_this_strategy**
   Explain the core business rationale of "{scenario_name}" relative to a priority of {priority}/100. Write 2-3 sentences.
2. **key_inventory_factors**
   Call out 2-3 specific products from the data. Discuss their current_stock_units, shelf_life_days, or avg_weekly_sales_units to justify the recommended order quantities. Keep numbers 100% accurate to the data.
3. **business_impact**
   State the forecast business outcome (e.g. cash flow efficiency, waste levels, or potential revenue captures).
4. **risks**
   State any risks associated with this specific strategy (e.g. stockouts if demand surges, or waste if short shelf-life items don't sell).
5. **suggested_actions**
   Provide exactly 3 concrete, data-grounded action items to execute tomorrow. Each item must contain:
   - "action": What needs to be done.
   - "product": The product name (or null if general). Must match a product name in the data exactly.
   - "reason": A single, data-backed sentence explaining why (citing specific sales, stock, shelf-life, event, or weather numbers).

## Response Schema (JSON ONLY)
{{
  "why_this_strategy": "string",
  "key_inventory_factors": "string",
  "business_impact": "string",
  "risks": "string",
  "suggested_actions": [
    {{
      "action": "string",
      "product": "string or null",
      "reason": "string"
    }}
  ]
}}
"""
    return prompt
