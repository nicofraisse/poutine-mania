import axios from 'axios'
import { useState, useEffect } from 'react'

const useGet = (url, options = {}) => {
  const [payload, setPayload] = useState(undefined)
  const [loading, setLoading] = useState(!options.skip)
  const [error, setError] = useState(undefined)

  useEffect(() => {
    if (!options.skip) {
      setLoading(true)
      axios
        .get(url)
        .then(({ data }) => {
          setPayload(data)
          setLoading(false)
        })
        .catch((e) => setError(e))
    }
  }, [url, options.skip])

  return { data: payload, loading, error }
}

export { useGet }
