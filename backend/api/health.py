"""GET /health – liveness probe for Cloud Run."""
from fastapi import APIRouter
from datetime import datetime, timezone

router = APIRouter()


@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "DecisionIQ API",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
