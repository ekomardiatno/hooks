import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'

export const CANCEL_REQUEST = 'CANCEL_REQUEST'

const useFetch = (service, callback) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reload, setReload] = useState(false)
  const [source, setSource] = useState(null)

  useEffect(() => {
    const cancelToken = axios.cancelToken
    setSource(cancelToken.source())
    return () => {
      setSource(null)
      cancelToken.source().cancel(CANCEL_REQUEST)
    }
  }, [])

  const fetch = useCallback(() => {
    if (!source) return
    if (reload) return setReload(false)
    if (!service) return setLoading(false)
    setLoading(true)
    setError(null)
    service(source.token)
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
  }, [source, reload])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { data, loading, error, reloading: () => setReload(true), canceling: () => source.cancel(CANCEL_REQUEST) }
}

export default useFetch


