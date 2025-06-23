import axios from 'axios';
import { toast } from 'react-toastify';

// Create axios instance with defaults
export const 
api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    // Handle specific HTTP errors
    if (response) {
      // Authentication errors
      if (response.status === 401) {
        localStorage.removeItem('token');
        if (window.location.pathname !== '/login' && 
            window.location.pathname !== '/register') {
          toast.error('Your session has expired. Please log in again.');
          window.location.href = '/login';
        }
      }
      
      // Forbidden errors
      else if (response.status === 403) {
        toast.error('You do not have permission to perform this action');
      }
      
      // Not found errors
      else if (response.status === 404) {
        toast.error('The requested resource was not found');
      }
      
      // Validation errors
      else if (response.status === 400 || response.status === 422) {
        if (response.data && response.data.message) {
          toast.error(response.data.message);
        } else {
          toast.error('Validation error. Please check your input.');
        }
      }
      
      // Server errors
      else if (response.status >= 500) {
        toast.error('Server error. Please try again later.');
      }
    } else {
      // Network errors
      toast.error('Network error. Please check your connection.');
    }
    
    return Promise.reject(error);
  }
);