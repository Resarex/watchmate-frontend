import { create } from 'zustand';
import api from '../api/axios';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  // Initialize auth state from localStorage
  initialize: () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      set({ isAuthenticated: true, isLoading: false });
      // Optionally fetch user profile here
    } else {
      set({ isLoading: false });
    }
  },

  // Login
  login: async (username, password) => {
    try {
      const response = await api.post('/account/login/', {
        username,
        password,
      });

      const { access, refresh } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      set({ isAuthenticated: true, user: { username } });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Login failed',
      };
    }
  },

  // Register
  register: async (username, email, password, password2) => {
    try {
      const response = await api.post('/account/register/', {
        username,
        email,
        password,
        password2,
      });

      const { tokens } = response.data;
      localStorage.setItem('access_token', tokens.access);
      localStorage.setItem('refresh_token', tokens.refresh);

      set({ isAuthenticated: true, user: { username, email } });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Registration failed',
      };
    }
  },

  // Logout
  logout: async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        await api.post('/account/logout/', {
          refresh_token: refreshToken,
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      set({ isAuthenticated: false, user: null });
    }
  },

  // Fetch user profile
  fetchProfile: async () => {
    try {
      const response = await api.get('/watch/profile/me/');
      set({ user: response.data });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  },
}));

export default useAuthStore;