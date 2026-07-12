const API_BASE = process.env.REACT_APP_API_URL || '/api';

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }
  return response.json();
};

export const get = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });
  return handleResponse(response);
};

export const post = async (endpoint, data, options = {}) => {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    body: JSON.stringify(data),
    ...options
  });
  return handleResponse(response);
};

export const put = async (endpoint, data, options = {}) => {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    body: JSON.stringify(data),
    ...options
  });
  return handleResponse(response);
};

export const delete_ = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });
  return handleResponse(response);
};
