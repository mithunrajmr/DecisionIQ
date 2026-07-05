"""Inventory API – handles listing, creation, modification, and deletion of products."""
from fastapi import APIRouter, HTTPException
from services.bigquery_service import bigquery_service
from utils.inventory_helpers import summarise_inventory
from models.schemas import InventoryItem

router = APIRouter()


@router.get("")
def get_inventory():
    try:
        items = bigquery_service.get_inventory()
        return summarise_inventory(items)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to load inventory: {str(exc)}")


@router.post("", response_model=InventoryItem)
def add_product(item: InventoryItem):
    try:
        bigquery_service.add_product(item.dict())
        return item
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@router.put("/{product_name}", response_model=InventoryItem)
def update_product(product_name: str, item: InventoryItem):
    try:
        bigquery_service.update_product(product_name, item.dict())
        return item
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@router.delete("/{product_name}")
def delete_product(product_name: str):
    try:
        bigquery_service.delete_product(product_name)
        return {"status": "success", "message": f"Product '{product_name}' deleted."}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
