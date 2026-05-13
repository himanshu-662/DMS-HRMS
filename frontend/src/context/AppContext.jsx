import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.PROD ? '' : 'http://localhost:8000';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('dms-token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Seed Data ─────────────────────────────────────────────────────────────────

const seedPayroll = [
  { id: 'p1', employeeId: 'DMS001', employeeName: 'Alice Johnson', department: 'Engineering', basicSalary: 8000, hra: 2000, allowances: 1500, deductions: 400, pf: 960, tax: 800, netSalary: 9340, status: 'processed', month: 'November 2024' },
  { id: 'p2', employeeId: 'DMS002', employeeName: 'Bob Smith', department: 'Design', basicSalary: 7000, hra: 1750, allowances: 1200, deductions: 300, pf: 840, tax: 700, netSalary: 8110, status: 'pending', month: 'November 2024' },
  { id: 'p3', employeeId: 'DMS003', employeeName: 'Carol White', department: 'Product', basicSalary: 9000, hra: 2250, allowances: 1800, deductions: 500, pf: 1080, tax: 950, netSalary: 10520, status: 'pending', month: 'November 2024' },
  { id: 'p4', employeeId: 'DMS004', employeeName: 'David Lee', department: 'Sales', basicSalary: 6500, hra: 1625, allowances: 1000, deductions: 250, pf: 780, tax: 620, netSalary: 7475, status: 'processed', month: 'November 2024' },
  { id: 'p5', employeeId: 'DMS005', employeeName: 'Eva Martinez', department: 'Marketing', basicSalary: 7500, hra: 1875, allowances: 1300, deductions: 350, pf: 900, tax: 740, netSalary: 8685, status: 'pending', month: 'November 2024' },
];

const seedLeaves = [
  { id: 'l1', employeeId: 'DMS001', employeeName: 'Alice Johnson', type: 'sick', startDate: '2024-11-15', endDate: '2024-11-17', days: 3, reason: 'Medical appointment', status: 'pending', appliedDate: '2024-11-14' },
  { id: 'l2', employeeId: 'DMS002', employeeName: 'Bob Smith', type: 'casual', startDate: '2024-11-20', endDate: '2024-11-22', days: 3, reason: 'Personal work', status: 'approved', appliedDate: '2024-11-10' },
  { id: 'l3', employeeId: 'DMS003', employeeName: 'Carol White', type: 'annual', startDate: '2024-12-01', endDate: '2024-12-05', days: 5, reason: 'Vacation', status: 'pending', appliedDate: '2024-11-20' },
  { id: 'l4', employeeId: 'DMS004', employeeName: 'David Lee', type: 'sick', startDate: '2024-11-10', endDate: '2024-11-11', days: 2, reason: 'Fever', status: 'rejected', appliedDate: '2024-11-09' },
];

const seedLeaveBalances = [
  { employeeId: 'DMS001', annual: 12, sick: 8, casual: 6 },
  { employeeId: 'DMS002', annual: 10, sick: 6, casual: 5 },
];

const seedAttendance = [
  { id: 'a1', employeeName: 'Alice Johnson', department: 'Engineering', date: new Date().toISOString().split('T')[0], checkIn: '09:05', checkOut: '18:00', totalHours: 8.9, status: 'present' },
  { id: 'a2', employeeName: 'Bob Smith', department: 'Design', date: new Date().toISOString().split('T')[0], checkIn: '09:30', checkOut: '18:30', totalHours: 9, status: 'late' },
  { id: 'a3', employeeName: 'Carol White', department: 'Product', date: new Date().toISOString().split('T')[0], checkIn: '-', checkOut: '-', totalHours: 0, status: 'absent' },
  { id: 'a4', employeeName: 'David Lee', department: 'Sales', date: new Date().toISOString().split('T')[0], checkIn: '09:00', checkOut: '-', totalHours: 0, status: 'wfh' },
];

const seedShifts = [
  { id: 's1', name: 'Morning Shift', startTime: '09:00', endTime: '18:00', type: 'day', color: '#6366F1', assignedCount: 45, employees: ['Alice Johnson', 'Bob Smith'] },
  { id: 's2', name: 'Evening Shift', startTime: '14:00', endTime: '23:00', type: 'evening', color: '#F59E0B', assignedCount: 22, employees: ['David Lee'] },
  { id: 's3', name: 'Night Shift', startTime: '22:00', endTime: '07:00', type: 'night', color: '#8B5CF6', assignedCount: 12, employees: ['Eva Martinez'] },
];

const seedAssets = [
  { id: 'as1', name: 'MacBook Pro M3', type: 'Laptop', serialNumber: 'SN-MB-001', assignedTo: 'Alice Johnson', assignedDate: '2024-01-15', status: 'assigned', condition: 'excellent' },
  { id: 'as2', name: 'Dell XPS 15', type: 'Laptop', serialNumber: 'SN-DX-002', assignedTo: '', assignedDate: '', status: 'available', condition: 'good' },
  { id: 'as3', name: 'iPhone 15 Pro', type: 'Phone', serialNumber: 'SN-IP-003', assignedTo: 'Bob Smith', assignedDate: '2024-02-10', status: 'assigned', condition: 'excellent' },
  { id: 'as4', name: 'Samsung 27" Monitor', type: 'Monitor', serialNumber: 'SN-SM-004', assignedTo: '', assignedDate: '', status: 'maintenance', condition: 'fair' },
  { id: 'as5', name: 'iPad Air 5', type: 'Tablet', serialNumber: 'SN-IA-005', assignedTo: 'Carol White', assignedDate: '2024-03-01', status: 'assigned', condition: 'good' },
];

const seedPerformanceReviews = [
  { id: 'pr1', employeeName: 'Alice Johnson', reviewer: 'John Manager', reviewPeriod: 'Q3 2024', status: 'completed', rating: 4.5, goals: [
    { id: 'g1', title: 'Complete API migration', description: 'Migrate REST APIs to GraphQL', progress: 100, status: 'completed', dueDate: '2024-09-30' },
    { id: 'g2', title: 'Improve test coverage', description: 'Reach 80% code coverage', progress: 75, status: 'in_progress', dueDate: '2024-12-31' },
  ]},
  { id: 'pr2', employeeName: 'Bob Smith', reviewer: 'John Manager', reviewPeriod: 'Q3 2024', status: 'in_progress', rating: 0, goals: [
    { id: 'g3', title: 'Redesign design system', description: 'Unify all UI components', progress: 60, status: 'in_progress', dueDate: '2024-11-30' },
  ]},
  { id: 'pr3', employeeName: 'Carol White', reviewer: 'Jane Admin', reviewPeriod: 'Q3 2024', status: 'pending', rating: 0, goals: [
    { id: 'g4', title: 'Launch product roadmap', description: 'Define Q1 2025 roadmap', progress: 30, status: 'in_progress', dueDate: '2024-12-15' },
  ]},
];

const seedTickets = [
  { id: 't1', title: 'Cannot access payroll portal', description: 'Getting 403 error when trying to view my payslip', category: 'IT', priority: 'high', status: 'open', createdBy: 'Bob Smith', assignedTo: 'Support Team', createdDate: '2024-11-14' },
  { id: 't2', title: 'Leave balance incorrect', description: 'My annual leave balance shows 0 but I should have 8 days remaining', category: 'Leave', priority: 'medium', status: 'in_progress', createdBy: 'David Lee', assignedTo: 'HR Team', createdDate: '2024-11-12' },
  { id: 't3', title: 'Laptop keyboard broken', description: 'Several keys on my laptop are not responding', category: 'Assets', priority: 'high', status: 'resolved', createdBy: 'Alice Johnson', assignedTo: 'IT Support', createdDate: '2024-11-10' },
];

const seedJobPostings = [
  { id: 'j1', title: 'Senior Software Engineer', department: 'Engineering', location: 'Remote', type: 'full_time', experience: '5+ years', applicants: 28, status: 'open', postedDate: '2024-11-01', description: 'Looking for a senior engineer to lead backend services.' },
  { id: 'j2', title: 'UX Designer', department: 'Design', location: 'New York', type: 'full_time', experience: '3+ years', applicants: 15, status: 'open', postedDate: '2024-11-05', description: 'Design beautiful user experiences for our product.' },
  { id: 'j3', title: 'Product Manager', department: 'Product', location: 'San Francisco', type: 'full_time', experience: '4+ years', applicants: 10, status: 'closed', postedDate: '2024-10-15', description: 'Drive product vision and strategy.' },
];

const seedCandidates = [
  { id: 'c1', name: 'Mark Reynolds', email: 'mark@example.com', phone: '+1 555-1001', position: 'Senior Software Engineer', stage: 'interview', appliedDate: '2024-11-02', rating: 4.2 },
  { id: 'c2', name: 'Sarah Kim', email: 'sarah@example.com', phone: '+1 555-1002', position: 'UX Designer', stage: 'screening', appliedDate: '2024-11-06', rating: 0 },
  { id: 'c3', name: 'James Brown', email: 'james@example.com', phone: '+1 555-1003', position: 'Senior Software Engineer', stage: 'technical', appliedDate: '2024-11-03', rating: 3.8 },
  { id: 'c4', name: 'Priya Sharma', email: 'priya@example.com', phone: '+1 555-1004', position: 'UX Designer', stage: 'selected', appliedDate: '2024-11-07', rating: 4.7 },
];

const seedNotifications = [
  { id: 'n1', title: 'Leave request', message: 'Alice johnson requested 3 days sick leave.', type: 'info', category: 'alert', read: false, timestamp: new Date().toISOString() },
  { id: 'n2', title: 'Payroll processed', message: "November payroll has been processed for 2 employees.", type: 'success', category: 'update', read: false, timestamp: new Date().toISOString() },
];

const seedTasks = [
  { id: 'tk1', title: 'Update design system', description: 'Implement new color palette across all modules', priority: 'high', status: 'in_progress', dueDate: '2024-11-30', assignee: 'Alice Johnson', category: 'design' },
  { id: 'tk2', title: 'Payroll audit', description: 'Review Q3 payroll distributions for tax compliance', priority: 'medium', status: 'todo', dueDate: '2024-12-05', assignee: 'Bob Smith', category: 'finance' },
  { id: 'tk3', title: 'Employee handbook', description: 'Update remote work policies for 2025', priority: 'low', status: 'completed', dueDate: '2024-11-15', assignee: 'Carol White', category: 'hr' },
];

// ── Initial State ─────────────────────────────────────────────────────────────

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
  attendance: seedAttendance,
  leaveRequests: seedLeaves,
  leaveBalances: seedLeaveBalances,
  payroll: seedPayroll,
  jobPostings: seedJobPostings,
  candidates: seedCandidates,
  performanceReviews: seedPerformanceReviews,
  assets: seedAssets,
  tickets: seedTickets,
  notifications: seedNotifications,
  shifts: seedShifts,
  tasks: seedTasks,
  toasts: [],
  isLoading: false,
  todayCheckIn: null,
  todayCheckOut: null,
  settings: { company_name: 'DMS HRMS', gps_attendance: false, auto_gen_id: true }
});

const generateId = () => Math.random().toString(36).substring(2, 11);

// ── Reducer ───────────────────────────────────────────────────────────────────

function appReducer(state, action) {
  switch (action.type) {

    // Auth
    case 'LOGIN_SUCCESS':
      localStorage.setItem('dms-token', action.payload.token);
      return { ...state, isAuthenticated: true, currentUser: action.payload.user, showLanding: false };
    case 'LOGOUT':
      localStorage.removeItem('dms-token');
      return { ...getInitialState(), darkMode: state.darkMode };

    // Misc
    case 'SET_DATA': return { ...state, ...action.payload };
    case 'SET_SETTINGS': return { ...state, settings: action.payload };
    case 'TOGGLE_DARK_MODE': return { ...state, darkMode: !state.darkMode };
    case 'SET_SHOW_LANDING': return { ...state, showLanding: action.payload };
    case 'SET_PAGE': return { ...state, currentPage: action.payload, mobileMenuOpen: false };
    case 'TOGGLE_SIDEBAR': return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
    case 'TOGGLE_MOBILE_MENU': return { ...state, mobileMenuOpen: !state.mobileMenuOpen };
    case 'SET_SEARCH': return { ...state, searchQuery: action.payload };
    case 'SET_LOADING': return { ...state, isLoading: action.payload };
    case 'HYDRATE': return { ...state, ...action.payload };

    // Toasts
    case 'ADD_TOAST': return { ...state, toasts: [...state.toasts, { ...action.payload, id: generateId() }] };
    case 'REMOVE_TOAST': return { ...state, toasts: state.toasts.filter((t) => t.id !== action.payload) };

    // Notifications
    case 'ADD_NOTIFICATION': return { ...state, notifications: [action.payload, ...state.notifications] };
    case 'MARK_NOTIFICATION_READ': return { ...state, notifications: state.notifications.map((n) => n.id === action.payload ? { ...n, read: true } : n) };
    case 'MARK_ALL_NOTIFICATIONS_READ': return { ...state, notifications: state.notifications.map((n) => ({ ...n, read: true })) };
    case 'CLEAR_NOTIFICATIONS': return { ...state, notifications: [] };

    // Attendance
    case 'CHECK_IN': return { ...state, todayCheckIn: new Date().toLocaleTimeString() };
    case 'CHECK_OUT': return { ...state, todayCheckOut: new Date().toLocaleTimeString() };
    case 'ADD_ATTENDANCE': return { ...state, attendance: [...state.attendance, { ...action.payload, id: generateId() }] };
    case 'UPDATE_ATTENDANCE': return { ...state, attendance: state.attendance.map((a) => a.id === action.payload.id ? { ...a, ...action.payload } : a) };

    // Leaves
    case 'ADD_LEAVE': return { ...state, leaveRequests: [{ ...action.payload, id: generateId(), status: 'pending', appliedDate: new Date().toISOString().split('T')[0] }, ...state.leaveRequests] };
    case 'APPROVE_LEAVE': return { ...state, leaveRequests: state.leaveRequests.map((l) => l.id === action.payload ? { ...l, status: 'approved' } : l) };
    case 'REJECT_LEAVE': return { ...state, leaveRequests: state.leaveRequests.map((l) => l.id === action.payload ? { ...l, status: 'rejected' } : l) };
    case 'DELETE_LEAVE': return { ...state, leaveRequests: state.leaveRequests.filter((l) => l.id !== action.payload) };
    case 'UPDATE_LEAVE': return { ...state, leaveRequests: state.leaveRequests.map((l) => l.id === action.payload.id ? { ...l, ...action.payload } : l) };

    // Payroll
    case 'ADD_PAYROLL': return { ...state, payroll: [...state.payroll, { ...action.payload, id: generateId() }] };
    case 'UPDATE_PAYROLL': return { ...state, payroll: state.payroll.map((p) => p.id === action.payload.id ? { ...p, ...action.payload } : p) };
    case 'DELETE_PAYROLL': return { ...state, payroll: state.payroll.filter((p) => p.id !== action.payload) };
    case 'PROCESS_PAYROLL': return { ...state, payroll: state.payroll.map((p) => p.id === action.payload ? { ...p, status: 'processed' } : p) };
    case 'PROCESS_ALL_PAYROLL': return { ...state, payroll: state.payroll.map((p) => ({ ...p, status: 'processed' })) };

    // Shifts
    case 'ADD_SHIFT': return { ...state, shifts: [...state.shifts, { ...action.payload, id: generateId() }] };
    case 'UPDATE_SHIFT': return { ...state, shifts: state.shifts.map((s) => s.id === action.payload.id ? { ...s, ...action.payload } : s) };
    case 'DELETE_SHIFT': return { ...state, shifts: state.shifts.filter((s) => s.id !== action.payload) };

    // Assets
    case 'ADD_ASSET': return { ...state, assets: [...state.assets, action.payload] };
    case 'UPDATE_ASSET': return { ...state, assets: state.assets.map((a) => a.id === action.payload.id ? { ...a, ...action.payload } : a) };
    case 'DELETE_ASSET': return { ...state, assets: state.assets.filter((a) => a.id !== action.payload) };
    case 'ASSIGN_ASSET': return { ...state, assets: state.assets.map((a) => a.id === action.payload.id ? { ...a, assignedTo: action.payload.assignedTo, assignedDate: new Date().toISOString().split('T')[0], status: 'assigned' } : a) };
    case 'UNASSIGN_ASSET': return { ...state, assets: state.assets.map((a) => a.id === action.payload ? { ...a, assignedTo: '', assignedDate: '', status: 'available' } : a) };

    // Performance
    case 'ADD_REVIEW': return { ...state, performanceReviews: [...state.performanceReviews, { ...action.payload, id: generateId() }] };
    case 'UPDATE_REVIEW': return { ...state, performanceReviews: state.performanceReviews.map((r) => r.id === action.payload.id ? { ...r, ...action.payload } : r) };
    case 'DELETE_REVIEW': return { ...state, performanceReviews: state.performanceReviews.filter((r) => r.id !== action.payload) };
    case 'UPDATE_GOAL_PROGRESS':
      return {
        ...state,
        performanceReviews: state.performanceReviews.map((r) =>
          r.id === action.payload.reviewId
            ? { ...r, goals: r.goals.map((g) => g.id === action.payload.goalId ? { ...g, progress: action.payload.progress, status: action.payload.progress === 100 ? 'completed' : action.payload.progress > 0 ? 'in_progress' : 'pending' } : g) }
            : r
        )
      };

    // Help Desk
    case 'ADD_TICKET': return { ...state, tickets: [action.payload, ...state.tickets] };
    case 'UPDATE_TICKET': return { ...state, tickets: state.tickets.map((t) => t.id === action.payload.id ? { ...t, ...action.payload } : t) };
    case 'RESOLVE_TICKET': return { ...state, tickets: state.tickets.map((t) => t.id === action.payload ? { ...t, status: 'resolved' } : t) };
    case 'DELETE_TICKET': return { ...state, tickets: state.tickets.filter((t) => t.id !== action.payload) };

    // Recruitment
    case 'ADD_JOB': return { ...state, jobPostings: [action.payload, ...state.jobPostings] };
    case 'UPDATE_JOB': return { ...state, jobPostings: state.jobPostings.map((j) => j.id === action.payload.id ? { ...j, ...action.payload } : j) };
    case 'DELETE_JOB': return { ...state, jobPostings: state.jobPostings.filter((j) => j.id !== action.payload) };
    case 'CLOSE_JOB': return { ...state, jobPostings: state.jobPostings.map((j) => j.id === action.payload ? { ...j, status: 'closed' } : j) };
    case 'ADD_CANDIDATE': return { ...state, candidates: [action.payload, ...state.candidates] };
    case 'UPDATE_CANDIDATE': return { ...state, candidates: state.candidates.map((c) => c.id === action.payload.id ? { ...c, ...action.payload } : c) };
    case 'DELETE_CANDIDATE': return { ...state, candidates: state.candidates.filter((c) => c.id !== action.payload) };
    case 'MOVE_CANDIDATE_STAGE': return { ...state, candidates: state.candidates.map((c) => c.id === action.payload.id ? { ...c, stage: action.payload.stage } : c) };

    // Tasks
    case 'ADD_TASK': return { ...state, tasks: [action.payload, ...state.tasks] };
    case 'UPDATE_TASK': return { ...state, tasks: state.tasks.map((t) => t.id === action.payload.id ? { ...t, ...action.payload } : t) };
    case 'DELETE_TASK': return { ...state, tasks: state.tasks.filter((t) => t.id !== action.payload) };
    case 'TOGGLE_TASK_STATUS': 
      return { 
        ...state, 
        tasks: state.tasks.map((t) => 
          t.id === action.payload 
            ? { ...t, status: t.status === 'completed' ? 'todo' : 'completed' } 
            : t
        ) 
      };

    default:
      return state;
  }
}

// ── Context ───────────────────────────────────────────────────────────────────

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
    if (state.darkMode) document.body.classList.add('dark');
    else document.body.classList.remove('dark');
  }, [state.darkMode]);

  useEffect(() => {
    if (state.isAuthenticated) {
      localStorage.setItem('dms-hrms-state', JSON.stringify({
        isAuthenticated: state.isAuthenticated,
        currentUser: state.currentUser,
        darkMode: state.darkMode,
        attendance: state.attendance,
        leaveRequests: state.leaveRequests,
        leaveBalances: state.leaveBalances,
        payroll: state.payroll,
        jobPostings: state.jobPostings,
        candidates: state.candidates,
        performanceReviews: state.performanceReviews,
        assets: state.assets,
        tickets: state.tickets,
        notifications: state.notifications,
        shifts: state.shifts,
        tasks: state.tasks,
        settings: state.settings
      }));
    }
  }, [state]);

  useEffect(() => {
    if (state.isAuthenticated) {
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
      const updates = {};
      if (emp.data?.length) updates.employees = emp.data;
      if (att.data?.length) updates.attendance = att.data;
      if (leave.data?.length) updates.leaveRequests = leave.data;
      if (Object.keys(updates).length) dispatch({ type: 'SET_DATA', payload: updates });
      if (settings.data && Object.keys(settings.data).length) dispatch({ type: 'SET_SETTINGS', payload: settings.data });
    } catch (error) {
      console.warn('Backend unavailable - using persistent local storage');
    }
  };

  const updateSettings = async (updates) => {
    try {
      await api.post('/api/settings', updates);
      dispatch({ type: 'SET_SETTINGS', payload: { ...state.settings, ...updates } });
      showToast('success', 'Settings Saved', 'Preferences updated successfully.');
    } catch {
      showToast('error', 'Update Failed', 'Server error while saving settings.');
    }
  };

  const showToast = (type, title, message) => {
    const id = generateId();
    dispatch({ type: 'ADD_TOAST', payload: { id, type, title, message } });
    setTimeout(() => {
      dispatch({ type: 'REMOVE_TOAST', payload: id });
    }, 3000);
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
      showToast('success', 'Account Created', `Welcome, ${name}!`);
      return true;
    } catch (error) {
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

  const navigateTo = (page) => {
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