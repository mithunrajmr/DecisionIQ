import { useState, useEffect } from 'react'

/**
 * Generic data-fetching hook.
 * @param {Function} fetchFn  - async function returning data
 * @param {Array}    deps     - dependency array to re-trigger
 */
export function useFetch(fetchFn, deps = []) {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await fetchFn()
        if (!cancelled) setData(result)
      } catch (err) {
        if (!cancelled)
          setError(err?.response?.data?.detail || err.message || 'Unknown error')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    run()
    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { data, loading, error }
}
