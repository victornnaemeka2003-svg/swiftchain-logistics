export async function apiCall(endpoint, options = {}) {
  const response = await fetch(`/api${endpoint}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }

  return response.json();
}

export async function apiGet(endpoint) {
  return apiCall(endpoint, { method: 'GET' });
}

export async function apiPost(endpoint, data) {
  return apiCall(endpoint, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function apiPut(endpoint, data) {
  return apiCall(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function apiDelete(endpoint) {
  return apiCall(endpoint, { method: 'DELETE' });
}
