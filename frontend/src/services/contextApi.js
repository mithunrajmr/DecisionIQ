import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || '/api'

/**
 * Fetch tomorrow's weather and local event context.
 * @returns {Promise<ContextResponse>}
 */
export async function fetchContext() {
  const { data } = await axios.get(`${BASE}/context`)
  return data
}
