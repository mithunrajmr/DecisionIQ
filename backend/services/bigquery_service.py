"""
BigQuery Service – reads inventory data from BigQuery.
All BigQuery interaction lives here; no business logic.
"""
import os
import logging
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Mock fallback data (used when BigQuery is not configured / unavailable)
# ---------------------------------------------------------------------------
MOCK_INVENTORY: List[Dict[str, Any]] = [
    {
        "product_name": "Bananas",
        "category": "Fruits",
        "avg_weekly_sales_units": 120,
        "current_stock_units": 80,
        "shelf_life_days": 5,
        "unit_cost": 0.30,
        "unit_price": 0.75,
        "weather_sensitivity": "low",
        "local_event_flag": True,
    },
    {
        "product_name": "Strawberries",
        "category": "Fruits",
        "avg_weekly_sales_units": 60,
        "current_stock_units": 30,
        "shelf_life_days": 3,
        "unit_cost": 1.20,
        "unit_price": 2.80,
        "weather_sensitivity": "high",
        "local_event_flag": True,
    },
    {
        "product_name": "Whole Milk (1L)",
        "category": "Dairy",
        "avg_weekly_sales_units": 200,
        "current_stock_units": 150,
        "shelf_life_days": 7,
        "unit_cost": 0.90,
        "unit_price": 1.60,
        "weather_sensitivity": "low",
        "local_event_flag": False,
    },
    {
        "product_name": "Greek Yogurt",
        "category": "Dairy",
        "avg_weekly_sales_units": 80,
        "current_stock_units": 45,
        "shelf_life_days": 10,
        "unit_cost": 1.10,
        "unit_price": 2.20,
        "weather_sensitivity": "low",
        "local_event_flag": False,
    },
    {
        "product_name": "Sourdough Bread",
        "category": "Bakery",
        "avg_weekly_sales_units": 50,
        "current_stock_units": 20,
        "shelf_life_days": 4,
        "unit_cost": 1.80,
        "unit_price": 3.50,
        "weather_sensitivity": "high",
        "local_event_flag": True,
    },
    {
        "product_name": "Croissants",
        "category": "Bakery",
        "avg_weekly_sales_units": 40,
        "current_stock_units": 15,
        "shelf_life_days": 2,
        "unit_cost": 0.80,
        "unit_price": 2.00,
        "weather_sensitivity": "high",
        "local_event_flag": True,
    },
    {
        "product_name": "Chicken Breast (500g)",
        "category": "Meat",
        "avg_weekly_sales_units": 90,
        "current_stock_units": 55,
        "shelf_life_days": 3,
        "unit_cost": 3.50,
        "unit_price": 6.00,
        "weather_sensitivity": "low",
        "local_event_flag": False,
    },
    {
        "product_name": "Salmon Fillet (300g)",
        "category": "Seafood",
        "avg_weekly_sales_units": 35,
        "current_stock_units": 18,
        "shelf_life_days": 2,
        "unit_cost": 5.00,
        "unit_price": 9.50,
        "weather_sensitivity": "high",
        "local_event_flag": True,
    },
    {
        "product_name": "Spinach (250g)",
        "category": "Vegetables",
        "avg_weekly_sales_units": 70,
        "current_stock_units": 40,
        "shelf_life_days": 5,
        "unit_cost": 0.60,
        "unit_price": 1.50,
        "weather_sensitivity": "low",
        "local_event_flag": False,
    },
    {
        "product_name": "Tomatoes (500g)",
        "category": "Vegetables",
        "avg_weekly_sales_units": 100,
        "current_stock_units": 65,
        "shelf_life_days": 6,
        "unit_cost": 0.80,
        "unit_price": 1.80,
        "weather_sensitivity": "low",
        "local_event_flag": False,
    },
    {
        "product_name": "Orange Juice (1L)",
        "category": "Beverages",
        "avg_weekly_sales_units": 85,
        "current_stock_units": 60,
        "shelf_life_days": 14,
        "unit_cost": 1.20,
        "unit_price": 2.50,
        "weather_sensitivity": "high",
        "local_event_flag": True,
    },
    {
        "product_name": "Eggs (12 pack)",
        "category": "Dairy",
        "avg_weekly_sales_units": 150,
        "current_stock_units": 100,
        "shelf_life_days": 21,
        "unit_cost": 2.00,
        "unit_price": 3.80,
        "weather_sensitivity": "low",
        "local_event_flag": False,
    },
    {
        "product_name": "Avocados",
        "category": "Fruits",
        "avg_weekly_sales_units": 55,
        "current_stock_units": 30,
        "shelf_life_days": 4,
        "unit_cost": 0.90,
        "unit_price": 2.00,
        "weather_sensitivity": "low",
        "local_event_flag": False,
    },
    {
        "product_name": "Mozzarella (250g)",
        "category": "Dairy",
        "avg_weekly_sales_units": 45,
        "current_stock_units": 25,
        "shelf_life_days": 8,
        "unit_cost": 1.50,
        "unit_price": 3.20,
        "weather_sensitivity": "low",
        "local_event_flag": True,
    },
    {
        "product_name": "Blueberries (150g)",
        "category": "Fruits",
        "avg_weekly_sales_units": 48,
        "current_stock_units": 22,
        "shelf_life_days": 4,
        "unit_cost": 1.80,
        "unit_price": 3.50,
        "weather_sensitivity": "high",
        "local_event_flag": True,
    },
]


class BigQueryService:
    """
    Wraps Google BigQuery reads for DecisionIQ inventory data.
    Falls back to MOCK_INVENTORY when BigQuery credentials are absent.
    """

    def __init__(self):
        self.project_id = os.getenv("GOOGLE_CLOUD_PROJECT") or os.getenv("PROJECT_ID")
        self.dataset = os.getenv("DATASET_NAME", "decisioniq")
        self.table = os.getenv("TABLE_NAME", "inventory_data")
        self._client = None
        self._use_mock = False

        if not self.project_id:
            logger.warning("GOOGLE_CLOUD_PROJECT not set – using mock inventory data.")
            self._use_mock = True
        else:
            try:
                from google.cloud import bigquery  # noqa: F401
            except ImportError:
                logger.warning("google-cloud-bigquery not installed – using mock data.")
                self._use_mock = True

    def _get_client(self):
        if self._client is None:
            from google.cloud import bigquery
            self._client = bigquery.Client(project=self.project_id)
        return self._client

    def get_inventory(self) -> List[Dict[str, Any]]:
        """
        Returns list of inventory row dicts.
        Falls back to mock data if BigQuery is unavailable.
        """
        if self._use_mock:
            logger.info("Serving inventory from mock fallback data.")
            print("[DecisionIQ] Serving inventory from mock fallback data.")
            return MOCK_INVENTORY

        try:
            client = self._get_client()
            query = f"""
                SELECT
                    product_name,
                    category,
                    avg_weekly_sales_units,
                    current_stock_units,
                    shelf_life_days,
                    unit_cost,
                    unit_price,
                    weather_sensitivity,
                    local_event_flag
                FROM `{self.project_id}.{self.dataset}.{self.table}`
                ORDER BY category, product_name
            """
            rows = list(client.query(query).result())
            logger.info("Serving inventory from BigQuery table: %s.%s.%s", self.project_id, self.dataset, self.table)
            print(f"[DecisionIQ] Serving inventory from BigQuery table: {self.project_id}.{self.dataset}.{self.table}")
            return [dict(row) for row in rows]
        except Exception as exc:
            logger.error("BigQuery query failed: %s – falling back to mock data.", exc)
            print(f"[DecisionIQ] BigQuery query failed ({exc}) – falling back to mock data.")
            return MOCK_INVENTORY


# Singleton instance reused across requests
bigquery_service = BigQueryService()
