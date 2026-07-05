"""
Context Service – returns tomorrow's weather and local event information.
In production this would call a weather API; here it uses a deterministic mock
seeded from today's date so the demo always shows consistent data.
"""
import os
import hashlib
import logging
from datetime import date, timedelta
from typing import Dict, Any

logger = logging.getLogger(__name__)

WEATHER_OPTIONS = [
    {"condition": "Rainy",  "temperature_c": 18.0, "description": "Light to moderate rain expected throughout the day."},
    {"condition": "Sunny",  "temperature_c": 28.0, "description": "Clear skies and bright sunshine all day."},
    {"condition": "Cloudy", "temperature_c": 22.0, "description": "Overcast with occasional breaks in cloud cover."},
    {"condition": "Stormy", "temperature_c": 15.0, "description": "Heavy rain and strong winds forecast."},
    {"condition": "Partly Cloudy", "temperature_c": 25.0, "description": "Mix of sun and clouds, pleasant conditions."},
]

EVENTS = [
    {"has_event": True,  "event_name": "Neighbourhood Food Festival", "event_description": "Annual community food festival expected to draw large crowds to the area."},
    {"has_event": True,  "event_name": "Weekend Farmers Market",      "event_description": "Popular weekly market increasing foot traffic by an estimated 40%."},
    {"has_event": True,  "event_name": "Local School Fete",           "event_description": "School fundraising event bringing families to the district."},
    {"has_event": False, "event_name": None, "event_description": None},
    {"has_event": False, "event_name": None, "event_description": None},
]


class ContextService:
    """Returns weather and event context for tomorrow's date."""

    def get_context(self) -> Dict[str, Any]:
        tomorrow = date.today() + timedelta(days=1)

        # Deterministic pseudo-random selection keyed to date
        seed = int(hashlib.md5(tomorrow.isoformat().encode()).hexdigest(), 16)

        weather = WEATHER_OPTIONS[seed % len(WEATHER_OPTIONS)]
        event   = EVENTS[(seed // 7) % len(EVENTS)]

        # Allow env override for demo consistency
        forced_weather = os.getenv("DEMO_WEATHER")
        if forced_weather:
            matches = [w for w in WEATHER_OPTIONS if w["condition"].lower() == forced_weather.lower()]
            if matches:
                weather = matches[0]

        return {
            "weather": weather,
            "event": event,
            "date": tomorrow.isoformat(),
        }


context_service = ContextService()
