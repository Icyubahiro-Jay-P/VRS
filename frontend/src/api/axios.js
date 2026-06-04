import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Auth APIs
export const authAPI = {
  register: (username, password, role) =>
    api.post('/api/auth/register', { username, password, role }),
  login: (username, password) => api.post('/api/auth/login', { username, password }),
  logout: () => api.post('/api/auth/logout'),
};

// Customer APIs
export const customerAPI = {
  getAll: (search = '') => api.get(`/api/customers?search=${search}`),
  getById: (id) => api.get(`/api/customers/${id}`),
  create: (data) => api.post('/api/customers', data),
  update: (id, data) => api.put(`/api/customers/${id}`, data),
  delete: (id) => api.delete(`/api/customers/${id}`),
};

// Vehicle APIs
export const vehicleAPI = {
  getAll: (search = '', status = '') =>
    api.get(`/api/vehicles?search=${search}&status=${status}`),
  getByPlate: (plate) => api.get(`/api/vehicles/${plate}`),
  create: (data) => api.post('/api/vehicles', data),
  update: (id, data) => api.put(`/api/vehicles/${id}`, data),
  delete: (id) => api.delete(`/api/vehicles/${id}`),
};

// Reservation APIs
export const reservationAPI = {
  getAll: (customerID = '', status = '', dateFrom = '', dateTo = '') =>
    api.get(
      `/api/reservations?customerID=${customerID}&status=${status}&dateFrom=${dateFrom}&dateTo=${dateTo}`
    ),
  getById: (id) => api.get(`/api/reservations/${id}`),
  create: (data) => api.post('/api/reservations', data),
  update: (id, data) => api.put(`/api/reservations/${id}`, data),
  delete: (id) => api.delete(`/api/reservations/${id}`),
  getReport: () => api.get('/api/reservations/report/all'),
};

export default api;
