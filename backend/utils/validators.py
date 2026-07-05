"""
Validators – ensures Gemini's JSON output matches our expected schema.
"""
import logging
from typing import Any, Dict, List

logger = logging.getLogger(__name__)

REQUIRED_SCENARIO_KEYS = {"name", "score", "suggested_order", "estimated_profit",
                           "estimated_waste", "benefits", "risks"}
VALID_NAMES = {"Conservative", "Aggressive", "AI Recommended"}


def validate_scenarios(raw: Any) -> List[Dict[str, Any]]:
    """
    Validates and normalises a list of scenario dicts returned by Gemini.
    Raises ValueError if the structure is fundamentally broken.
    """
    if not isinstance(raw, list):
        raise ValueError(f"Expected list of scenarios, got {type(raw)}")

    validated = []
    seen_names = set()

    for item in raw:
        if not isinstance(item, dict):
            continue

        # Ensure required keys exist with sane defaults
        name = item.get("name", "Unknown")
        if name not in VALID_NAMES:
            logger.warning("Unexpected scenario name: %s — keeping anyway.", name)

        scenario = {
            "name":             str(name),
            "rank":             int(item.get("rank", 99)),
            "score":            float(item.get("score", 0.0)),
            "suggested_order":  dict(item.get("suggested_order", {})),
            "estimated_profit": str(item.get("estimated_profit", "N/A")),
            "estimated_waste":  str(item.get("estimated_waste", "N/A")),
            "benefits":         list(item.get("benefits", [])),
            "risks":            list(item.get("risks", [])),
        }

        # Clamp score
        scenario["score"] = max(0.0, min(100.0, scenario["score"]))

        # Ensure suggested_order values are ints
        scenario["suggested_order"] = {
            k: max(0, int(v)) for k, v in scenario["suggested_order"].items()
        }

        if name not in seen_names:
            validated.append(scenario)
            seen_names.add(name)

    if not validated:
        raise ValueError("No valid scenarios found in Gemini response.")

    # Re-rank by score descending to be safe
    validated.sort(key=lambda s: s["score"], reverse=True)
    for i, s in enumerate(validated, 1):
        s["rank"] = i

    return validated
