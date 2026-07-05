"""GET /inventory – returns inventory data from BigQuery."""
from fastapi import APIRouter, HTTPException
from services.bigquery_service import bigquery_service
from utils.inventory_helpers import summarise_inventory

router = APIRouter()


@router.get("")
def get_inventory():
    try:
        items = bigquery_service.get_inventory()
        return summarise_inventory(items)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to load inventory: {str(exc)}")
