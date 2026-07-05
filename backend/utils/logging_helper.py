"""
DecisionIQ AI status reporting helper.
"""
import logging

logger = logging.getLogger(__name__)

def print_ai_status(
    bq_connected: bool,
    gemini_connected: bool,
    source: str,
    model: str,
    latency: float,
    fallback: bool,
    inventory_rows: int,
    weather: str,
    event: str,
    priority: int,
    exception_reason: str = None
):
    print("\n" + "=" * 40)
    print("DecisionIQ AI STATUS")
    print("=" * 40)
    print(f"BigQuery       : {'Connected' if bq_connected else 'Failed'}")
    print(f"Gemini         : {'Connected' if gemini_connected else 'Failed'}")
    if exception_reason:
        # Truncate exception reason to keep console clean
        reason_str = str(exception_reason)[:80] + ("..." if len(str(exception_reason)) > 80 else "")
        print(f"Reason         : {reason_str}")
    print(f"Source         : {source}")
    print(f"Model          : {model}")
    print(f"Latency        : {latency:.2f} sec")
    print(f"Fallback       : {'YES' if fallback else 'No'}")
    print(f"Inventory Rows : {inventory_rows}")
    print(f"Weather        : {weather}")
    print(f"Event          : {event}")
    print(f"Priority       : {priority}")
    print("=" * 40 + "\n")
