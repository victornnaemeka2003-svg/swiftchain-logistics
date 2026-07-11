import { useState, useCallback } from 'react';

export function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetch = useCallback(async (fetchOptions = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await window.fetch(url, {
        credentials: 'include',
        ...options,
        ...fetchOptions
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Request failed');
      }

      const result = await response.json();
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  return { data, loading, error, fetch };
}
