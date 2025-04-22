import { create } from 'zustand';
import axios from 'axios';
import { API_URL } from '../config/constants';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

interface User {
  id: string;
  name: string;
  email: string;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  error: null,

  login: async (email, password) => {
    try {
      set({ loading: true, error: null });
      
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });
      
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      
      set({
        token,
        user,
        isAuthenticated: true,
        loading: false
      });
    } catch (error) {
      let errorMessage = 'Login failed. Please try again.';
      
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      
      set({
        error: errorMessage,
        loading: false
      });
    }
  },
  
  register: async (name, email, password) => {
    try {
      set({ loading: true, error: null });
      
      const response = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password
      });
      
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      
      set({
        token,
        user,
        isAuthenticated: true,
        loading: false
      });
    } catch (error) {
      let errorMessage = 'Registration failed. Please try again.';
      
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      
      set({
        error: errorMessage,
        loading: false
      });
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    set({
      user: null,
      token: null,
      isAuthenticated: false
    });
  },
  
  checkAuth: async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      set({ loading: false });
      return;
    }
    
    try {
      set({ loading: true });
      
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      set({
        user: response.data,
        isAuthenticated: true,
        loading: false
      });
    } catch (error) {
      localStorage.removeItem('token');
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false
      });
    }
  },
  
  clearError: () => set({ error: null })
}));