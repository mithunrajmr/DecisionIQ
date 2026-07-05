import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || '/api'

/**
 * Fetch a Gemini plain-English explanation for a chosen scenario.
 * @param {string} scenario - e.g. "AI Recommended"
 * @param {number} priority - current slider value
 * @returns {Promise<ExplanationResponse>}
 */
export async function fetchExplanation(scenario, priority) {
  const { data } = await axios.post(`${BASE}/explanation`, { scenario, priority })
  return data
}
