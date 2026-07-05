"""
DecisionIQ Backend – FastAPI entry point.
"""
import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

env_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path=env_path)

from api import inventory, context, scenarios, explanation, health

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
print("AUDIT - GOOGLE_CLOUD_PROJECT:", os.getenv("GOOGLE_CLOUD_PROJECT"))
print("AUDIT - GOOGLE_APPLICATION_CREDENTIALS:", os.getenv("GOOGLE_APPLICATION_CREDENTIALS"))
logger = logging.getLogger(__name__)

app = FastAPI(
    title="DecisionIQ API",
    version="1.0.0",
    description="AI Decision Intelligence platform for grocery inventory planning",
)

# ---------------------------------------------------------------------------
# CORS
# ---------------------------------------------------------------------------
_raw_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000")
origins = [o.strip() for o in _raw_origins.split(",") if o.strip()]

# In development (no explicit origins configured beyond the defaults),
# we allow all origins so `npm run dev` works without extra config.
# Set ALLOWED_ORIGINS to the Cloud Run frontend URL to tighten in production.
_allow_all = os.getenv("ALLOW_ALL_ORIGINS", "false").lower() == "true"
_cors_origins = ["*"] if _allow_all else origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins,
    allow_credentials=not _allow_all,   # credentials forbidden with wildcard
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

logger.info("CORS configured for origins: %s", _cors_origins)

# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------
app.include_router(health.router,      tags=["Health"])
app.include_router(inventory.router,   prefix="/inventory",  tags=["Inventory"])
app.include_router(context.router,     prefix="/context",    tags=["Context"])
app.include_router(scenarios.router,   tags=["Scenarios"])
app.include_router(explanation.router, tags=["Explanation"])
