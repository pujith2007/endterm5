import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('crewup_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 unauth token expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired/invalid, clear local token
      const currentPath = window.location.pathname;
      if (
        !currentPath.includes('/login') &&
        !currentPath.includes('/register') &&
        currentPath !== '/'
      ) {
        // Only redirect if on protected page
        localStorage.removeItem('crewup_token');
        localStorage.removeItem('crewup_user');
      }
    }
    return Promise.reject(error);
  }
);

// ================= Auth API =================
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// ================= Projects API =================
export const projectsAPI = {
  getProjects: (params) => api.get('/projects', { params }),
  getProjectById: (id) => api.get(`/projects/${id}`),
  createProject: (data) => api.post('/projects', data),
  updateProject: (id, data) => api.put(`/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/projects/${id}`),
  getMyProjects: () => api.get('/projects/my-projects'),
  getRecommendations: () => api.get('/projects/recommendations'),
};

// ================= Join Requests API =================
export const requestsAPI = {
  createJoinRequest: (data) => api.post('/requests', data),
  getUserRequests: () => api.get('/requests/my-applications'),
  getProjectRequests: (projectId) => api.get(`/requests/project/${projectId}`),
  updateRequestStatus: (id, status) => api.put(`/requests/${id}`, { status }),
  cancelRequest: (id) => api.delete(`/requests/${id}`),
};

// ================= Tasks API =================
export const tasksAPI = {
  getProjectTasks: (projectId) => api.get(`/tasks/project/${projectId}`),
  createTask: (data) => api.post('/tasks', data),
  updateTask: (id, data) => api.put(`/tasks/${id}`, data),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
};

// ================= Notifications API =================
export const notificationsAPI = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/mark-all-read'),
};

export default api;
