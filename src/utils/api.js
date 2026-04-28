import axios from 'axios';

// ✅ Backend base URL from Vercel environment variable
const API_BASE = process.env.REACT_APP_API_URL;

// ❌ Safety check (helps debugging if env is missing)
if (!API_BASE) {
  console.error("❌ REACT_APP_API_URL is not defined");
}

// ✅ Axios instance with correct base URL
const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: {
    "Content-Type": "application/json"
  }
});

// ✅ Attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Handle global errors (like auth expiration)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Unauthorized → logout
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }

      // Optional: handle server errors
      if (error.response.status === 500) {
        console.error("🔥 Server error:", error.response.data);
      }
    }

    return Promise.reject(error);
  }
);

// ================= AUTH APIs =================
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// ================= EXAM APIs =================
export const examAPI = {
  start: () => api.get('/exam/start'),
  submit: (data) => api.post('/exam/submit', data),
  reportCheat: (data) => api.post('/exam/anti-cheat/report', data),
  getResult: () => api.get('/exam/result'),
};

// ================= ADMIN APIs =================
export const adminAPI = {
  getResults: () => api.get('/admin/results'),
  getShortlist: () => api.get('/admin/shortlist'),
  getStats: () => api.get('/admin/stats'),
};

// Export base instance
export default api;