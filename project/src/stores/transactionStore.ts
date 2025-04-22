import { create } from 'zustand';
import axios from 'axios';
import { API_URL } from '../config/constants';

export type TransactionType = 'income' | 'expense' | 'transfer';

export interface Transaction {
  _id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  type: TransactionType;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionInput {
  amount: number;
  description: string;
  category: string;
  date: string;
  type: TransactionType;
}

interface TransactionState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  
  getTransactions: () => Promise<void>;
  getTransactionsByMonth: (month: number, year: number) => Promise<void>;
  addTransaction: (transaction: TransactionInput) => Promise<void>;
  updateTransaction: (id: string, transaction: Partial<TransactionInput>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  loading: false,
  error: null,
  
  getTransactions: async () => {
    try {
      set({ loading: true, error: null });
      
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/transactions`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      set({
        transactions: response.data,
        loading: false
      });
    } catch (error) {
      let errorMessage = 'Failed to fetch transactions.';
      
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      
      set({
        error: errorMessage,
        loading: false
      });
    }
  },
  
  getTransactionsByMonth: async (month, year) => {
    try {
      set({ loading: true, error: null });
      
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/transactions/monthly?month=${month}&year=${year}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      set({
        transactions: response.data,
        loading: false
      });
    } catch (error) {
      let errorMessage = 'Failed to fetch transactions.';
      
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      
      set({
        error: errorMessage,
        loading: false
      });
    }
  },
  
  addTransaction: async (transaction) => {
    try {
      set({ loading: true, error: null });
      
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/transactions`,
        transaction,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      set((state) => ({
        transactions: [...state.transactions, response.data],
        loading: false
      }));
    } catch (error) {
      let errorMessage = 'Failed to add transaction.';
      
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      
      set({
        error: errorMessage,
        loading: false
      });
    }
  },
  
  updateTransaction: async (id, transaction) => {
    try {
      set({ loading: true, error: null });
      
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/transactions/${id}`,
        transaction,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      set((state) => ({
        transactions: state.transactions.map((item) => 
          item._id === id ? response.data : item
        ),
        loading: false
      }));
    } catch (error) {
      let errorMessage = 'Failed to update transaction.';
      
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      
      set({
        error: errorMessage,
        loading: false
      });
    }
  },
  
  deleteTransaction: async (id) => {
    try {
      set({ loading: true, error: null });
      
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/transactions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      set((state) => ({
        transactions: state.transactions.filter((item) => item._id !== id),
        loading: false
      }));
    } catch (error) {
      let errorMessage = 'Failed to delete transaction.';
      
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