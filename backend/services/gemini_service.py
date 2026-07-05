"""
Gemini Service – wraps Vertex AI Gemini calls.
Sends prompts, receives JSON, validates structure.
"""
import os
import json
import logging
import re
from typing import Any, Dict

logger = logging.getLogger(__name__)

_MODEL_FALLBACK = "gemini-2.5-flash"


class GeminiService:
    """
    Thin wrapper around Vertex AI generative model calls.
    Falls back to a rules-based response when credentials are absent.
    """

    def __init__(self):
        self.project_id = os.getenv("GOOGLE_CLOUD_PROJECT") or os.getenv("PROJECT_ID")
        self.location = os.getenv("VERTEX_LOCATION", "us-central1")
        self.model_name = os.getenv("VERTEX_MODEL", _MODEL_FALLBACK)
        self._model = None
        self._use_mock = False

        if not self.project_id:
            logger.warning("GOOGLE_CLOUD_PROJECT not set – Gemini will use rule-based fallback.")
            self._use_mock = True
        else:
            try:
                import vertexai  # noqa: F401
            except ImportError:
                logger.warning("vertexai not installed – using rule-based fallback.")
                self._use_mock = True

    def _get_model(self):
        if self._model is None:
            import vertexai
            from vertexai.generative_models import GenerativeModel, GenerationConfig
            vertexai.init(project=self.project_id, location=self.location)
            self._model = GenerativeModel(
                self.model_name,
                generation_config=GenerationConfig(
                    response_mime_type="application/json",
                    temperature=0.3,
                    max_output_tokens=8192,
                ),
            )
        return self._model

    def generate(self, prompt: str) -> Dict[str, Any]:
        """
        Send a prompt to Gemini and return a parsed JSON dict.
        """
        if self._use_mock:
            raise RuntimeError("Gemini not configured – rule-based fallback active.")

        try:
            model = self._get_model()
            response = model.generate_content(prompt)
            raw = response.text.strip()
            # Strip markdown code fences if present
            raw = re.sub(r"^```(?:json)?\s*", "", raw)
            raw = re.sub(r"\s*```$", "", raw)
            return json.loads(raw)
        except Exception as exc:
            logger.error("Gemini generation failed: %s", exc)
            raise

    def generate_text(self, prompt: str) -> str:
        """
        Send a prompt to Gemini and return plain text (for explanation endpoint).
        """
        if self._use_mock:
            raise RuntimeError("Gemini not configured – rule-based fallback active.")

        try:
            import vertexai
            from vertexai.generative_models import GenerativeModel, GenerationConfig
            vertexai.init(project=self.project_id, location=self.location)
            model = GenerativeModel(
                self.model_name,
                generation_config=GenerationConfig(temperature=0.4, max_output_tokens=2048),
            )
            response = model.generate_content(prompt)
            return response.text.strip()
        except Exception as exc:
            logger.error("Gemini text generation failed: %s", exc)
            raise


# Singleton
gemini_service = GeminiService()
