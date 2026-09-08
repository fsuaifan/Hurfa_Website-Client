/**
 * Hurfa API Service Layer
 * Centralized HTTP Client connecting Hurfa_Website-Client to Hurfa_Website-Server
 */

const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Helper to build auth & role headers from active session
 */
function getHeaders(customHeaders = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  try {
    const userStr = sessionStorage.getItem('hurfa_user') || localStorage.getItem('hurfa_user');
    const isAdminAuth = sessionStorage.getItem('hurfa_admin_authenticated') === 'true';

    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.role === 'admin' || isAdminAuth) {
        headers['x-role'] = 'admin';
      }
      if (user.email) {
        headers['x-user-email'] = user.email;
      }
    } else if (isAdminAuth) {
      headers['x-role'] = 'admin';
    }
  } catch (err) {
    console.warn('[API Client] Could not parse session data:', err);
  }

  return headers;
}

/**
 * Generic Fetch wrapper with JSON parsing and error handling
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    ...options,
    headers: getHeaders(options.headers),
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMsg = data?.message || data?.error || `HTTP ${response.status}: ${response.statusText}`;
      const error = new Error(errorMsg);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    // Graceful offline warning
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      console.warn(`[API Client] Could not connect to Hurfa Server at ${url}. Ensure server is running.`);
    }
    throw err;
  }
}

export const api = {
  // Authentication
  auth: {
    login: (credentials) =>
      request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    signup: (userData) =>
      request('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
    me: (email) => request(`/auth/me?email=${encodeURIComponent(email)}`),
  },

  // Products Catalog
  products: {
    getAll: (params = {}) => {
      const query = new URLSearchParams();
      if (params.category && params.category !== 'All') query.append('category', params.category);
      if (params.search) query.append('search', params.search);
      if (params.sort && params.sort !== 'default') query.append('sort', params.sort);
      const qs = query.toString() ? `?${query.toString()}` : '';
      return request(`/products${qs}`);
    },
    getById: (id) => request(`/products/${id}`),
    getPremium: () => request('/products/premium'),
    getPremiumById: (id) => request(`/products/premium/${id}`),
    create: (data) =>
      request('/products', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id, data) =>
      request(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id) =>
      request(`/products/${id}`, {
        method: 'DELETE',
      }),
  },

  // Kitchens Showcase
  kitchens: {
    getAll: () => request('/kitchens'),
    getTypes: () => request('/kitchens/types'),
    getById: (id) => request(`/kitchens/${id}`),
  },

  // Bedrooms Collection
  bedrooms: {
    getAll: () => request('/bedrooms'),
    getById: (id) => request(`/bedrooms/${id}`),
  },

  // Shopping Cart
  cart: {
    get: (email) => request(`/users/cart/${encodeURIComponent(email)}`),
    add: (item) =>
      request('/users/cart', {
        method: 'POST',
        body: JSON.stringify(item),
      }),
    remove: (email, productId) =>
      request(`/users/cart/${encodeURIComponent(email)}/${productId}`, {
        method: 'DELETE',
      }),
    clear: (email) =>
      request(`/users/cart/${encodeURIComponent(email)}`, {
        method: 'DELETE',
      }),
  },

  // Orders & Consultations
  orders: {
    getAll: (params = {}) => {
      const query = new URLSearchParams();
      if (params.status && params.status !== 'All') query.append('status', params.status);
      if (params.search) query.append('search', params.search);
      const qs = query.toString() ? `?${query.toString()}` : '';
      return request(`/orders${qs}`);
    },
    getById: (id) => request(`/orders/${id}`),
    create: (orderData) =>
      request('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      }),
    updateStatus: (id, status) =>
      request(`/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      }),
    delete: (id) =>
      request(`/orders/${id}`, {
        method: 'DELETE',
      }),
  },

  // Studio Admin Catalog & KPIs
  catalog: {
    getStats: () => request('/catalog/stats'),
    getAll: (params = {}) => {
      const query = new URLSearchParams();
      if (params.category && params.category !== 'All') query.append('category', params.category);
      if (params.search) query.append('search', params.search);
      if (params.sort) query.append('sort', params.sort);
      const qs = query.toString() ? `?${query.toString()}` : '';
      return request(`/catalog${qs}`);
    },
    getById: (id) => request(`/catalog/${id}`),
    create: (data) =>
      request('/catalog', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id, data) =>
      request(`/catalog/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    updateSort: (items) =>
      request('/catalog/sort', {
        method: 'PUT',
        body: JSON.stringify({ items }),
      }),
    delete: (id) =>
      request(`/catalog/${id}`, {
        method: 'DELETE',
      }),
  },

  // Studio Patron CRM Clients
  clients: {
    getAll: (params = {}) => {
      const query = new URLSearchParams();
      if (params.status && params.status !== 'All') query.append('status', params.status);
      if (params.search) query.append('search', params.search);
      const qs = query.toString() ? `?${query.toString()}` : '';
      return request(`/clients${qs}`);
    },
    getById: (id) => request(`/clients/${id}`),
    create: (data) =>
      request('/clients', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id, data) =>
      request(`/clients/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id) =>
      request(`/clients/${id}`, {
        method: 'DELETE',
      }),
  },

  // Categories
  categories: {
    getAll: () => request('/categories'),
    getById: (id) => request(`/categories/${id}`),
  },
};

export default api;
