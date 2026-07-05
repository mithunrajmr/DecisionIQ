"""POST /generate-scenarios – generates 3 ranked purchasing strategies via Gemini."""
from fastapi import APIRouter, HTTPException
from models.schemas import ScenarioRequest, ScenariosResponse
from services.decision_service import decision_service

router = APIRouter()


@router.post("/generate-scenarios", response_model=ScenariosResponse)
def generate_scenarios(request: ScenarioRequest):
    try:
        return decision_service.generate_scenarios(request.priority)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Scenario generation failed: {str(exc)}")
