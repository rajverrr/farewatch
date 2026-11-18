import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000
});

export const getAirports = async (query = '') => {
  const res = await api.get('/airports', { params: { q: query } });
  return res.data;
};

export const getFestivals = async () => {
  const res = await api.get('/festivals');
  return res.data;
};

export const searchFlights = async (searchParamsOrOrigin, dest, dt, extra = {}) => {
  let params = {};
  if (typeof searchParamsOrOrigin === 'object' && searchParamsOrOrigin !== null) {
    params = searchParamsOrOrigin;
  } else {
    params = {
      origin: searchParamsOrOrigin,
      destination: dest,
      date: dt,
      ...extra
    };
  }

  const res = await api.get('/flights/search', { params });
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
