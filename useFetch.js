import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'

export const CANCEL_REQUEST = 'CANCEL_REQUEST'

const useFetch = (service, callback) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cancelTokenSource, setCancelTokenSource] = useState(null)

  useEffect(() => {
    if(!loading) return null
    const cancelToken = axios.cancelToken
    const source = cancelToken.source()
    setCancelTokenSource(source)
    fetch(source)
    return () => {
      setCancelTokenSource(null)
      source.cancel(CANCEL_REQUEST)
    }
  }, [loading])

  const fetch = (source) => {

    if (!service) return setLoading(false)
    const definedService = service(source.token)
    if (!definedService) return setLoading(false)
    setError(null)
    definedService
      .then(res => {
        if (!res.success) {
          if (typeof callback === 'function') callback(res, true)
          return setError(res.message || 'Enexpected response')
        }
        setData(res.data)
        if (typeof callback === 'function') callback(res, false)
      })
      .catch(error => {
        setError(error)
        if (typeof callback === 'function') callback(error, true)
      })
      .finally(() => {
        setLoading(false)
      })
  })



  return { data, loading, error, reloading: () => setLoading(true), canceling: () => cancelTokenSource?.cancel(CANCEL_REQUEST) }
}

export default useFetch


