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
    Model instances are initialised once and reused (singleton pattern).
    """

    def __init__(self):
        self.project_id = os.getenv("GOOGLE_CLOUD_PROJECT") or os.getenv("PROJECT_ID")
        self.location   = os.getenv("VERTEX_LOCATION", "us-central1")
        self.model_name = os.getenv("VERTEX_MODEL", _MODEL_FALLBACK)
        self._json_model = None   # used by generate()
        self._text_model = None   # used by generate_text()
        self._use_mock   = False

        if not self.project_id:
            logger.warning("GOOGLE_CLOUD_PROJECT not set – Gemini will use rule-based fallback.")
            self._use_mock = True
        else:
            try:
                import vertexai  # noqa: F401
            except ImportError:
                logger.warning("vertexai not installed – using rule-based fallback.")
                self._use_mock = True

    # ── private helpers ────────────────────────────────────────────────────────

    def _get_json_model(self):
        """Lazy-init JSON model (application/json mime type)."""
        if self._json_model is None:
            import vertexai
            from vertexai.generative_models import GenerativeModel, GenerationConfig
            vertexai.init(project=self.project_id, location=self.location)
            self._json_model = GenerativeModel(
                self.model_name,
                generation_config=GenerationConfig(
                    response_mime_type="application/json",
                    temperature=0.3,
                    max_output_tokens=8192,
                ),
            )
        return self._json_model

    def _get_text_model(self):
        """Lazy-init plain-text model (for explanations)."""
        if self._text_model is None:
            import vertexai
            from vertexai.generative_models import GenerativeModel, GenerationConfig
            vertexai.init(project=self.project_id, location=self.location)
            self._text_model = GenerativeModel(
                self.model_name,
                generation_config=GenerationConfig(
                    temperature=0.4,
                    max_output_tokens=2048,
                ),
            )
        return self._text_model

    # ── public API ─────────────────────────────────────────────────────────────

    def generate(self, prompt: str) -> Dict[str, Any]:
        """Send a prompt to Gemini and return a parsed JSON dict."""
        if self._use_mock:
            raise RuntimeError("Gemini not configured – rule-based fallback active.")

        try:
            model  = self._get_json_model()
            raw    = model.generate_content(prompt).text.strip()
            # Strip markdown code fences if present
            raw    = re.sub(r"^```(?:json)?\s*", "", raw)
            raw    = re.sub(r"\s*```$",           "", raw)
            return json.loads(raw)
        except Exception as exc:
            logger.error("Gemini JSON generation failed: %s", exc)
            raise

    def generate_text(self, prompt: str) -> str:
        """Send a prompt to Gemini and return plain text (for explanations)."""
        if self._use_mock:
            raise RuntimeError("Gemini not configured – rule-based fallback active.")

        try:
            model = self._get_text_model()
            return model.generate_content(prompt).text.strip()
        except Exception as exc:
            logger.error("Gemini text generation failed: %s", exc)
            raise


# Singleton
gemini_service = GeminiService()
