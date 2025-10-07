// API Service per comunicazione con backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Helper per gestire errori
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Errore sconosciuto' }));
    throw new Error(error.error || error.message || 'Errore nella richiesta');
  }
  return response.json();
};

// Helper per headers con auth
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// ==================== AUTH API ====================

export const register = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  const data = await handleResponse(response);

  // Salva token e user
  if (data.token) {
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  }

  return data;
};

export const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await handleResponse(response);

  // Salva token e user
  if (data.token) {
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  }

  return data;
};

export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('authToken');
};

// ==================== PASSWORD RECOVERY ====================

export const forgotPassword = async (email) => {
  const response = await fetch(`${API_BASE_URL}/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  return handleResponse(response);
};

export const resetPassword = async (token, password) => {
  const response = await fetch(`${API_BASE_URL}/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, password })
  });
  return handleResponse(response);
};

// ==================== USER PROFILE ====================

export const getUserProfile = async () => {
  const response = await fetch(`${API_BASE_URL}/profile`, {
    headers: getAuthHeaders()
  });
  return handleResponse(response);
};

// ==================== CALCULATIONS ====================

export const saveCalculation = async (calculationData) => {
  const response = await fetch(`${API_BASE_URL}/calculations`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(calculationData)
  });
  return handleResponse(response);
};

export const getCalculations = async (limit = 50, offset = 0) => {
  const response = await fetch(`${API_BASE_URL}/calculations?limit=${limit}&offset=${offset}`, {
    headers: getAuthHeaders()
  });
  return handleResponse(response);
};

export const getCalculationById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/calculations/${id}`, {
    headers: getAuthHeaders()
  });
  return handleResponse(response);
};

// ==================== ADMIN ====================

export const getAdminStats = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/stats`, {
    headers: getAuthHeaders()
  });
  return handleResponse(response);
};

export const getAllUsers = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/users`, {
    headers: getAuthHeaders()
  });
  return handleResponse(response);
};

export const updateUser = async (userId, userData) => {
  const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(userData)
  });
  return handleResponse(response);
};

export const deleteUser = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  return handleResponse(response);
};

// ==================== HEALTH CHECK ====================

export const healthCheck = async () => {
  const response = await fetch(`${API_BASE_URL}/health`);
  return handleResponse(response);
};
