// Common utility functions for the e-commerce application
import axios, { AxiosInstance } from 'axios';
import { apiBaseUrl } from '../lib/config';

// API Client instance
export const createApiClient = (baseURL = apiBaseUrl): AxiosInstance => {
  return axios.create({
    baseURL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      'X-App-Version': '1.0.0',
    },
  });
};

export const apiClient = createApiClient();

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Currency formatting utility
export const formatCurrency = (amount: number, currency = 'XOF'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Image URL optimization (for Sanity CDN)
export const getSanityImageUrl = (
  imageAssetId: string,
  options?: { width?: number; height?: number; fit?: string }
): string => {
  const baseUrl = `https://cdn.sanity.io/images`;
  const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
  const dataset = import.meta.env.VITE_SANITY_DATASET;

  const [id] = imageAssetId.split('-').slice(0, -1);
  const ext = 'jpg';

  let url = `${baseUrl}/${projectId}/${dataset}/${id}.${ext}`;

  if (options) {
    const params = new URLSearchParams();
    if (options.width) params.set('w', String(options.width));
    if (options.height) params.set('h', String(options.height));
    if (options.fit) params.set('fit', options.fit);
    if (Object.keys(params).length > 0) {
      url += `?${params.toString()}`;
    }
  }

  return url;
};

// Debounce utility
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle utility
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Local storage with expiration
export const localStorage2 = {
  set: (key: string, value: any, expirationMs?: number) => {
    const item = {
      value,
      expiration: expirationMs ? Date.now() + expirationMs : null,
    };
    window.localStorage.setItem(key, JSON.stringify(item));
  },

  get: <T = any>(key: string): T | null => {
    const item = window.localStorage.getItem(key);
    if (!item) return null;

    try {
      const parsed = JSON.parse(item);
      if (parsed.expiration && Date.now() > parsed.expiration) {
        window.localStorage.removeItem(key);
        return null;
      }
      return parsed.value;
    } catch {
      return null;
    }
  },

  remove: (key: string) => {
    window.localStorage.removeItem(key);
  },

  clear: () => {
    window.localStorage.clear();
  },
};

// Parse query string
export const parseQueryString = (queryString: string): Record<string, string> => {
  const params = new URLSearchParams(queryString);
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
};

// Build query string
export const buildQueryString = (params: Record<string, any>): string => {
  const filtered = Object.entries(params)
    .filter(([_, value]) => value !== null && value !== undefined && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');

  return filtered ? `?${filtered}` : '';
};

// Validate email
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Generate slug from string
export const generateSlug = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Truncate text
export const truncateText = (text: string, maxLength: number, suffix = '...'): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - suffix.length) + suffix;
};
