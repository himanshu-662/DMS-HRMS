import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ToastContainer from './components/Toast';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';
import Leaves from './pages/Leaves';
import Payroll from './pages/Payroll';
import Recruitment from './pages/Recruitment';
import Performance from './pages/Performance';
import Assets from './pages/Assets';
import HelpDesk from './pages/HelpDesk';
import Shifts from './pages/Shifts';
import Tasks from './pages/Tasks';
import Reports from './pages/Reports';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import OrganizationManagement from './pages/OrganizationManagement';
import SystemHealth from './pages/SystemHealth';
import PlatformAnalytics from './pages/PlatformAnalytics';
import AuditLogs from './pages/AuditLogs';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Landing from './pages/Landing';
import { AppProvider, useApp } from './context/AppContext';
import { cn } from './utils/cn';
import { useState, useLayoutEffect } from 'react';

const roleAccess = {
  hr_admin: [
    'dashboard', 'employees', 'attendance', 'leaves', 'payroll', 'recruitment', 
    'performance', 'assets', 'helpdesk', 'shifts', 'tasks', 'reports', 
    'settings', 'profile', 'notifications'
  ],
  manager: [
    'dashboard', 'employees', 'attendance', 'leaves', 'performance', 
    'tasks', 'reports', 'settings', 'profile', 'notifications'
  ],
  employee: [
    'dashboard', 'attendance', 'leaves', 'payroll', 'performance', 
    'tasks', 'helpdesk', 'settings', 'profile', 'notifications'
  ],
  super_admin: [
    'super-admin-dashboard', 'organizations', 'subscriptions', 'billing', 
    'analytics', 'reports', 'monitoring', 'database', 'audit-logs', 
    'tickets', 'help', 'settings', 'profile', 'notifications'
  ]
};

function AppContent() {
  const { state } = useApp();
  const [showSignup, setShowSignup] = useState(false);

  // Apply Dynamic Branding
  useLayoutEffect(() => {
    const root = document.documentElement;
    const { primary_color, font_family } = state.settings;
    
    if (primary_color) {
      root.style.setProperty('--primary-500', primary_color);
      // Generate pseudo-shades for better UI
      root.style.setProperty('--primary-400', `${primary_color}cc`);
      root.style.setProperty('--primary-600', `${primary_color}ee`);
      root.style.setProperty('--primary-50', `${primary_color}10`);
    }
    
    if (font_family) {
      root.style.setProperty('--font-family', font_family);
    }
  }, [state.settings.primary_color, state.settings.font_family]);

  // Show landing page
  if (state.showLanding && !state.isAuthenticated) {
    return (
      <>
        <Landing onGetStarted={() => setShowSignup(true)} />
        <ToastContainer />
      </>);

  }

  // Show signup or login
  if (!state.isAuthenticated) {
    return (
      <>
        {showSignup ?
        <Signup onBackToLogin={() => setShowSignup(false)} /> :

        <Login onGoToSignup={() => setShowSignup(true)} />
        }
        <ToastContainer />
      </>);

  }

  const renderPage = () => {
    const role = state.currentUser?.role || 'employee';
    const allowedPages = roleAccess[role] || roleAccess.employee;
    
    // Safety check: if current page is not allowed for role, redirect to dashboard
    if (!allowedPages.includes(state.currentPage)) {
      const defaultPage = role === 'super_admin' ? 'super-admin-dashboard' : 'dashboard';
      setTimeout(() => {
        dispatch({ type: 'NAVIGATE', payload: defaultPage });
      }, 0);
      return role === 'super_admin' ? <SuperAdminDashboard /> : <Dashboard />;
    }

    switch (state.currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'employees': return <Employees />;
      case 'attendance': return <Attendance />;
      case 'leaves': return <Leaves />;
      case 'payroll': return <Payroll />;
      case 'recruitment': return <Recruitment />;
      case 'performance': return <Performance />;
      case 'assets': return <Assets />;
      case 'helpdesk': return <HelpDesk />;
      case 'shifts': return <Shifts />;
      case 'tasks': return <Tasks />;
      case 'reports': return <Reports />;
      case 'settings': return <Settings />;
      case 'profile': return <Profile />;
      case 'notifications': return <Notifications />;

      // Super Admin Pages
      case 'super-admin-dashboard': return <SuperAdminDashboard />;
      case 'organizations': return <OrganizationManagement />;
      case 'monitoring': return <SystemHealth />;
      case 'analytics': return <PlatformAnalytics />;
      case 'audit-logs': return <AuditLogs />;

      // Super Admin placeholder routes
      case 'subscriptions':
      case 'billing': return <Reports />;
      case 'database':
      case 'tickets':
      case 'help': return <HelpDesk />;

      default: return role === 'super_admin' ? <SuperAdminDashboard /> : <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen dark bg-zinc-950 selection:bg-primary-500/30 selection:text-primary-200">
      <Sidebar />
      <Header />
      <main
        className={cn(
          'pt-16 transition-all duration-300 min-h-screen',
          state.sidebarCollapsed ? 'lg:pl-[80px]' : 'lg:pl-[280px]'
        )}>
        
        <div className="p-4 lg:p-10 max-w-[1600px] mx-auto">
          {renderPage()}
        </div>
      </main>
      <ToastContainer />
    </div>);

}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>);

}