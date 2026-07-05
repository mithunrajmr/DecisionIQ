import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || '/api'

/**
 * Generate 3 ranked purchasing scenarios for a given priority.
 * @param {number} priority - 0 (waste reduction) to 100 (profit)
 * @returns {Promise<ScenariosResponse>}
 */
export async function generateScenarios(priority) {
  const { data } = await axios.post(`${BASE}/generate-scenarios`, { priority })
  return data
}
