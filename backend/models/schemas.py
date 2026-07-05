"""
Pydantic models – request and response schemas for DecisionIQ API.
"""
from typing import List, Optional, Dict
from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Inventory
# ---------------------------------------------------------------------------
class InventoryItem(BaseModel):
    product_name:          str
    category:              str
    avg_weekly_sales_units: int
    current_stock_units:   int
    shelf_life_days:       int
    unit_cost:             float
    unit_price:            float
    weather_sensitivity:   str
    local_event_flag:      bool


class InventoryResponse(BaseModel):
    items:             List[InventoryItem]
    total_products:    int
    total_stock_units: int
    categories:        List[str]
    avg_weekly_sales:  float


# ---------------------------------------------------------------------------
# Context
# ---------------------------------------------------------------------------
class WeatherInfo(BaseModel):
    condition:     str       # e.g. "Rainy", "Sunny", "Cloudy"
    temperature_c: float
    description:   str


class EventInfo(BaseModel):
    has_event:         bool
    event_name:        Optional[str] = None
    event_description: Optional[str] = None


class ContextResponse(BaseModel):
    weather: WeatherInfo
    event:   EventInfo
    date:    str


# ---------------------------------------------------------------------------
# Scenarios
# ---------------------------------------------------------------------------
class ScenarioRequest(BaseModel):
    priority: int = Field(..., ge=0, le=100,
                          description="0 = Max Waste Reduction, 100 = Max Profit")


class Scenario(BaseModel):
    name:             str    # Conservative | Aggressive | AI Recommended
    rank:             int
    score:            float
    suggested_order:  Dict[str, int]   # product_name -> units_to_order
    estimated_profit: str
    estimated_waste:  str
    benefits:         List[str]
    risks:            List[str]


class ScenariosResponse(BaseModel):
    scenarios:    List[Scenario]
    priority:     int
    generated_at: str


# ---------------------------------------------------------------------------
# Explanation + Suggested Actions
# ---------------------------------------------------------------------------
class ExplanationRequest(BaseModel):
    scenario: str = Field(..., description="Name of the scenario to explain")
    priority: int = Field(50, ge=0, le=100)


class SuggestedAction(BaseModel):
    action:  str           # Short action sentence
    product: Optional[str] = None   # The product it concerns, if applicable
    reason:  str           # One-sentence grounding rationale


class ExplanationResponse(BaseModel):
    scenario:              str
    why_this_strategy:     str
    key_inventory_factors: str
    business_impact:       str
    risks:                 str
    suggested_actions:     List[SuggestedAction] = []


# ---------------------------------------------------------------------------
# Health
# ---------------------------------------------------------------------------
class HealthResponse(BaseModel):
    status: str
