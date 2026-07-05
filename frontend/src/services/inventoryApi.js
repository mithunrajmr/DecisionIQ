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

export async function addInventoryProduct(product) {
  const { data } = await axios.post(`${BASE}/inventory`, product)
  return data
}

export async function updateInventoryProduct(productName, product) {
  const { data } = await axios.put(`${BASE}/inventory/${encodeURIComponent(productName)}`, product)
  return data
}

export async function deleteInventoryProduct(productName) {
  const { data } = await axios.delete(`${BASE}/inventory/${encodeURIComponent(productName)}`)
  return data
}
