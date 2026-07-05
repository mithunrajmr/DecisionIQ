"""
Inventory helpers – transforms raw BigQuery rows into summary statistics.
"""
from typing import Any, Dict, List


def summarise_inventory(items: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Return aggregated inventory statistics for the summary card."""
    if not items:
        return {
            "items": [],
            "total_products": 0,
            "total_stock_units": 0,
            "categories": [],
            "avg_weekly_sales": 0.0,
        }

    total_stock = sum(i["current_stock_units"] for i in items)
    avg_sales = sum(i["avg_weekly_sales_units"] for i in items) / len(items)
    categories = sorted(set(i["category"] for i in items))

    return {
        "items": items,
        "total_products": len(items),
        "total_stock_units": total_stock,
        "categories": categories,
        "avg_weekly_sales": round(avg_sales, 1),
    }
