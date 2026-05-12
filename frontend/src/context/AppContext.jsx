import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';






// Use Vercel's backend route prefix in production, localhost for development
const API_URL = import.meta.env.PROD ? '/_/backend' : 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL // API endpoints in main.py already include /api
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('dms-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});




















































const getInitialState = () => ({
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
  settings: {}
});

const generateId = () => Math.random().toString(36).substring(2, 11);

function appReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      localStorage.setItem('dms-token', action.payload.token);
      return {
        ...state,
        isAuthenticated: true,
        currentUser: action.payload.user,
        showLanding: false
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
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.payload) };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'HYDRATE':
      return { ...state, ...action.payload };

    default:
      return state;
  }
}













const AppContext = createContext(undefined);

export function AppProvider({ children }) {
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
    if (state.darkMode) document.body.classList.add('dark');else
    document.body.classList.remove('dark');
  }, [state.darkMode]);

  useEffect(() => {
    if (state.isAuthenticated) {
      localStorage.setItem('dms-hrms-state', JSON.stringify({
        isAuthenticated: state.isAuthenticated,
        currentUser: state.currentUser,
        darkMode: state.darkMode
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
      api.get('/api/settings')]
      );
      dispatch({ type: 'SET_DATA', payload: {
          employees: emp.data,
          attendance: att.data,
          leaveRequests: leave.data
        } });
      dispatch({ type: 'SET_SETTINGS', payload: settings.data });
    } catch (error) {
      console.error('Failed to refresh data', error);
    }
  };

  const updateSettings = async (updates) => {
    try {
      await api.post('/api/settings', updates);
      dispatch({ type: 'SET_SETTINGS', payload: { ...state.settings, ...updates } });
      showToast('success', 'Settings Saved', 'Platform preferences updated successfully');
    } catch (error) {
      showToast('error', 'Update Failed', 'Server error while saving settings');
    }
  };

  const showToast = (type, title, message) => {
    dispatch({ type: 'ADD_TOAST', payload: { type, title, message } });
  };

  const login = async (email, password, role) => {
    try {
      const response = await api.post('/api/auth/login', { email, password, role });
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.data });
      showToast('success', 'Welcome back!', `Logged in as ${response.data.user.name}`);
      return true;
    } catch (error) {
      showToast('error', 'Login failed', error.response?.data?.detail || 'Invalid credentials');
      return false;
    }
  };

  const signup = async (name, email, password, role) => {
    try {
      const response = await api.post('/api/auth/register', { name, email, password, role });
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.data });
      showToast('success', 'Account Created', `Welcome to the team, ${name}!`);
      return true;
    } catch (error) {
      const errorMsg = error.response?.data?.detail || error.message || 'Registration error';
      showToast('error', 'Signup failed', errorMsg);
      console.error("Signup error details:", error.response || error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('dms-hrms-state');
    localStorage.removeItem('dms-token');
    dispatch({ type: 'LOGOUT' });
    showToast('info', 'Logged out', 'See you next time!');
  };

  const navigateTo = (page) => {
    dispatch({ type: 'SET_PAGE', payload: page });
  };

  return (
    <AppContext.Provider value={{ state, dispatch, showToast, login, signup, logout, navigateTo, refreshData, updateSettings }}>
      {children}
    </AppContext.Provider>);

}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}