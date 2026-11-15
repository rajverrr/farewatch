import axios from 'axios';

const API_BASE = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000
});

export const getAirports = async (query = '') => {
  const res = await api.get('/airports', { params: { q: query } });
  return res.data;
};

export const getFestivals = async () => {
  const res = await api.get('/festivals');
  return res.data;
};

export const searchFlights = async (origin, destination, date) => {
  const res = await api.get('/flights/search', {
    params: { origin, destination, date }
  });
  return res.data;
};

export const getRouteBenchmark = async (origin, destination) => {
  const res = await api.get('/flights/benchmark', {
    params: { origin, destination }
  });
  return res.data;
};

export const getAlerts = async () => {
  const res = await api.get('/alerts');
  return res.data;
};

export const createAlert = async (alertData) => {
  const res = await api.post('/alerts', alertData);
  return res.data;
};

export const deleteAlert = async (id) => {
  const res = await api.delete(`/alerts/${id}`);
  return res.data;
};

export const triggerAlertTest = async (id) => {
  const res = await api.post(`/alerts/${id}/trigger`);
  return res.data;
};

export const runAllChecks = async () => {
  const res = await api.post('/alerts/run-check');
  return res.data;
};

export const getRecentNotifications = async () => {
  const res = await api.get('/notifications/recent');
  return res.data;
};

export const testDirectWhatsApp = async (phone, message, callMeBotApiKey) => {
  const res = await api.post('/notifications/test-whatsapp', {
    phone,
    message,
    callMeBotApiKey
  });
  return res.data;
};

export default api;
