import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || '/api'

/**
 * Fetch inventory summary from BigQuery via backend.
 * @returns {Promise<InventorySummary>}
 */
export async function fetchInventory() {
  const { data } = await axios.get(`${BASE}/inventory`)
  return data
}
