"""POST /explanation – returns a plain-English Gemini explanation + suggested actions."""
from fastapi import APIRouter, HTTPException
from models.schemas import ExplanationRequest, ExplanationResponse
from services.explanation_service import explanation_service

router = APIRouter()


@router.post("/explanation", response_model=ExplanationResponse)
def get_explanation(request: ExplanationRequest):
    try:
        return explanation_service.explain(request.scenario, request.priority)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Explanation generation failed: {str(exc)}")
