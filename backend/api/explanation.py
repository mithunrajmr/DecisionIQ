"""POST /explanation – returns a plain-English Gemini explanation for a chosen scenario."""
from fastapi import APIRouter, HTTPException
from models.schemas import ExplanationRequest
from services.explanation_service import explanation_service

router = APIRouter()


@router.post("/explanation")
def get_explanation(request: ExplanationRequest):
    try:
        return explanation_service.explain(request.scenario, request.priority)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Explanation generation failed: {str(exc)}")
