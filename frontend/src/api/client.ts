import axios from 'axios';

// Base URL from environment or default to localhost:8000
const API_BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api/v1';

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access (e.g., redirect to login)
            console.warn('Unauthorized access - redirecting to login');
            // window.location.href = '/login'; // Uncomment when login page exists
        }
        return Promise.reject(error);
    }
);

// API Service wrappers
export const ServiceB = {
    getGraphData: () => api.get('/supply-chain/graph-data/full-graph'),
    getDisruptions: () => api.get('/supply-chain/disruptions/current'),
    getInventory: () => api.get('/supply-chain/inventory/global-status'),
    reportDisruption: (data: any) => api.post('/supply-chain/disruptions/report', data),
    getNodeDetails: (nodeId: string) => api.get(`/supply-chain/graph-data/node/${nodeId}`),
    getHospitalNetwork: () => api.get('/supply-chain/hospital/network'),
    getHospitalRequests: () => api.get('/supply-chain/hospital/requests'),
    createHospitalRequest: (data: any) => api.post('/supply-chain/hospital/requests', data),
    fulfillRequest: (requestId: string) => api.post(`/supply-chain/hospital/fulfill/${requestId}`),
};

export const MockServiceA = {
    getOutbreaks: () => api.get('/biological-weather/outbreak-predictions/current'),
    getWeather: (regionId: string) => api.get(`/biological-weather/environmental-drivers/weather/${regionId}`),
    getDashboardAlerts: () => api.get('/biological-weather/dashboard/alerts'),
    getDashboardInsights: () => api.get('/biological-weather/dashboard/insights'),
    getLocalWeather: (lat: number, lng: number) => api.get(`/biological-weather/health-cast/local-weather?lat=${lat}&lng=${lng}`),
    getHealthCastAlerts: () => api.get('/biological-weather/health-cast/alerts'),
    getSafeZones: (lat: number, lng: number) => api.get(`/biological-weather/health-cast/safe-zones?lat=${lat}&lng=${lng}`),
};

export const MockServiceC = {
    getAlerts: () => api.get('/nexus/risk-analysis/critical-alerts'),
    runSimulation: (params: any) => api.post('/nexus/simulations/run', params),
    getAnalytics: () => api.get('/nexus/analytics/system-performance'),
    saveScenario: (data: any) => api.post('/nexus/simulations/scenarios', data),
};
