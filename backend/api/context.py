"""GET /context – returns tomorrow's weather and local event information."""
from fastapi import APIRouter, HTTPException
from services.context_service import context_service

router = APIRouter()


@router.get("")
def get_context():
    try:
        return context_service.get_context()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to load context: {str(exc)}")
