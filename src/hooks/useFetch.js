import { useState, useCallback } from 'react';

export const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api${url}`, options);
      if (!response.ok) throw new Error('Fetch failed');
      const result = await response.json();
      setData(result);
      return result;
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  return { data, loading, error, refetch: fetchData };
};
