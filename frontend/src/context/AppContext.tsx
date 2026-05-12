import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import axios from 'axios';
import type {
  User, Employee, AttendanceRecord, LeaveRequest, LeaveBalance,
  PayrollRecord, JobPosting, Candidate, PerformanceReview,
  Asset, HelpDeskTicket, Notification, Shift, PageType
} from '../types';

// Updated to point to Python FastAPI backend
const API_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL, // API endpoints in main.py already include /api
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('dms-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
}

interface AppState {
  isAuthenticated: boolean;
  currentUser: User | null;
  showLanding: boolean;
  darkMode: boolean;
  currentPage: PageType;
  sidebarCollapsed: boolean;
  mobileMenuOpen: boolean;
  searchQuery: string;
  employees: Employee[];
  attendance: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
  leaveBalances: LeaveBalance[];
  payroll: PayrollRecord[];
  jobPostings: JobPosting[];
  candidates: Candidate[];
  performanceReviews: PerformanceReview[];
  assets: Asset[];
  tickets: HelpDeskTicket[];
  notifications: Notification[];
  shifts: Shift[];
  toasts: Toast[];
  isLoading: boolean;
  todayCheckIn: string | null;
  todayCheckOut: string | null;
  settings: Record<string, any>;
}

type Action =
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'SET_PAGE'; payload: PageType }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'TOGGLE_MOBILE_MENU' }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'SET_SHOW_LANDING'; payload: boolean }
  | { type: 'ADD_TOAST'; payload: Omit<Toast, 'id'> }
  | { type: 'REMOVE_TOAST'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_DATA'; payload: Partial<AppState> }
  | { type: 'SET_SETTINGS'; payload: Record<string, any> }
  | { type: 'HYDRATE'; payload: Partial<AppState> };

const getInitialState = (): AppState => ({
  isAuthenticated: false,
  currentUser: null,
  showLanding: true,
  darkMode: false,
  currentPage: 'dashboard',
  sidebarCollapsed: false,
  mobileMenuOpen: false,
  searchQuery: '',
  employees: [],
  attendance: [],
  leaveRequests: [],
  leaveBalances: [],
  payroll: [],
  jobPostings: [],
  candidates: [],
  performanceReviews: [],
  assets: [],
  tickets: [],
  notifications: [],
  shifts: [],
  toasts: [],
  isLoading: false,
  todayCheckIn: null,
  todayCheckOut: null,
  settings: {},
});

const generateId = () => Math.random().toString(36).substring(2, 11);

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      localStorage.setItem('dms-token', action.payload.token);
      return {
        ...state,
        isAuthenticated: true,
        currentUser: action.payload.user,
        showLanding: false,
      };
    
    case 'LOGOUT':
      localStorage.removeItem('dms-token');
      return { ...getInitialState(), darkMode: state.darkMode };
    
    case 'SET_DATA':
      return { ...state, ...action.payload };

    case 'SET_SETTINGS':
      return { ...state, settings: action.payload };
    
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };
    
    case 'SET_SHOW_LANDING':
      return { ...state, showLanding: action.payload };
    
    case 'SET_PAGE':
      return { ...state, currentPage: action.payload, mobileMenuOpen: false };
    
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
    
    case 'TOGGLE_MOBILE_MENU':
      return { ...state, mobileMenuOpen: !state.mobileMenuOpen };
    
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.payload };
    
    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, { ...action.payload, id: generateId() }] };
    
    case 'REMOVE_TOAST':
      return { ...state, toasts: state.toasts.filter(t => t.id !== action.payload) };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'HYDRATE':
      return { ...state, ...action.payload };
    
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  showToast: (type: Toast['type'], title: string, message?: string) => void;
  login: (email: string, password: string, role?: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, role: string) => Promise<boolean>;
  logout: () => void;
  navigateTo: (page: PageType) => void;
  refreshData: () => Promise<void>;
  updateSettings: (updates: Record<string, any>) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, getInitialState());

  useEffect(() => {
    const saved = localStorage.getItem('dms-hrms-state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        dispatch({ type: 'HYDRATE', payload: parsed });
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (state.darkMode) document.body.classList.add('dark');
    else document.body.classList.remove('dark');
  }, [state.darkMode]);

  useEffect(() => {
    if (state.isAuthenticated) {
      localStorage.setItem('dms-hrms-state', JSON.stringify({
        isAuthenticated: state.isAuthenticated,
        currentUser: state.currentUser,
        darkMode: state.darkMode,
      }));
      refreshData();
    }
  }, [state.isAuthenticated]);

  const refreshData = async () => {
    try {
      const [emp, att, leave, settings] = await Promise.all([
        api.get('/api/employees'),
        api.get('/api/attendance'),
        api.get('/api/leaves'),
        api.get('/api/settings')
      ]);
      dispatch({ type: 'SET_DATA', payload: {
        employees: emp.data,
        attendance: att.data,
        leaveRequests: leave.data,
      }});
      dispatch({ type: 'SET_SETTINGS', payload: settings.data });
    } catch (error) {
      console.error('Failed to refresh data', error);
    }
  };

  const updateSettings = async (updates: Record<string, any>) => {
    try {
      await api.post('/api/settings', updates);
      dispatch({ type: 'SET_SETTINGS', payload: { ...state.settings, ...updates } });
      showToast('success', 'Settings Saved', 'Platform preferences updated successfully');
    } catch (error) {
      showToast('error', 'Update Failed', 'Server error while saving settings');
    }
  };

  const showToast = (type: Toast['type'], title: string, message?: string) => {
    dispatch({ type: 'ADD_TOAST', payload: { type, title, message } });
  };

  const login = async (email: string, password: string, role?: string): Promise<boolean> => {
    try {
      const response = await api.post('/api/auth/login', { email, password, role });
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.data });
      showToast('success', 'Welcome back!', `Logged in as ${response.data.user.name}`);
      return true;
    } catch (error: any) {
      showToast('error', 'Login failed', error.response?.data?.detail || 'Invalid credentials');
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string, role: string): Promise<boolean> => {
    try {
      const response = await api.post('/api/auth/register', { name, email, password, role });
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.data });
      showToast('success', 'Account Created', `Welcome to the team, ${name}!`);
      return true;
    } catch (error: any) {
      showToast('error', 'Signup failed', error.response?.data?.detail || 'Registration error');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('dms-hrms-state');
    localStorage.removeItem('dms-token');
    dispatch({ type: 'LOGOUT' });
    showToast('info', 'Logged out', 'See you next time!');
  };

  const navigateTo = (page: PageType) => {
    dispatch({ type: 'SET_PAGE', payload: page });
  };

  return (
    <AppContext.Provider value={{ state, dispatch, showToast, login, signup, logout, navigateTo, refreshData, updateSettings }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
