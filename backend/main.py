"""
DecisionIQ Backend – FastAPI entry point.
"""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from api import inventory, context, scenarios, explanation, health

load_dotenv()

app = FastAPI(
    title="DecisionIQ API",
    version="1.0.0",
    description="AI Decision Intelligence platform for grocery inventory planning",
)

# ---------------------------------------------------------------------------
# CORS – allow the Vite dev server and any Cloud Run frontend origin
# ---------------------------------------------------------------------------
origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # Tighten to `origins` in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------
app.include_router(health.router, tags=["Health"])
app.include_router(inventory.router, prefix="/inventory", tags=["Inventory"])
app.include_router(context.router, prefix="/context", tags=["Context"])
app.include_router(scenarios.router, tags=["Scenarios"])
app.include_router(explanation.router, tags=["Explanation"])
