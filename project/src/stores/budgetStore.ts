import { create } from 'zustand';
import axios from 'axios';
import { API_URL } from '../config/constants';

export interface Budget {
  _id: string;
  name: string;
  amount: number;
  category: string;
  period: 'monthly' | 'yearly';
  spent: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetInput {
  name: string;
  amount: number;
  category: string;
  period: 'monthly' | 'yearly';
}

interface BudgetState {
  budgets: Budget[];
  loading: boolean;
  error: string | null;
  
  getBudgets: () => Promise<void>;
  addBudget: (budget: BudgetInput) => Promise<void>;
  updateBudget: (id: string, budget: Partial<BudgetInput>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useBudgetStore = create<BudgetState>((set, get) => ({
  budgets: [],
  loading: false,
  error: null,
  
  getBudgets: async () => {
    try {
      set({ loading: true, error: null });
      
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/budgets`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      set({
        budgets: response.data,
        loading: false
      });
    } catch (error) {
      let errorMessage = 'Failed to fetch budgets.';
      
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      
      set({
        error: errorMessage,
        loading: false
      });
    }
  },
  
  addBudget: async (budget) => {
    try {
      set({ loading: true, error: null });
      
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/budgets`,
        budget,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      set((state) => ({
        budgets: [...state.budgets, response.data],
        loading: false
      }));
    } catch (error) {
      let errorMessage = 'Failed to add budget.';
      
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      
      set({
        error: errorMessage,
        loading: false
      });
    }
  },
  
  updateBudget: async (id, budget) => {
    try {
      set({ loading: true, error: null });
      
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/budgets/${id}`,
        budget,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      set((state) => ({
        budgets: state.budgets.map((item) => 
          item._id === id ? response.data : item
        ),
        loading: false
      }));
    } catch (error) {
      let errorMessage = 'Failed to update budget.';
      
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      
      set({
        error: errorMessage,
        loading: false
      });
    }
  },
  
  deleteBudget: async (id) => {
    try {
      set({ loading: true, error: null });
      
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/budgets/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      set((state) => ({
        budgets: state.budgets.filter((item) => item._id !== id),
        loading: false
      }));
    } catch (error) {
      let errorMessage = 'Failed to delete budget.';
      
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      
      set({
        error: errorMessage,
        loading: false
      });
    }
  },
  
  clearError: () => set({ error: null })
}));