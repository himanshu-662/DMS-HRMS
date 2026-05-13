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
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Landing from './pages/Landing';
import { AppProvider, useApp } from './context/AppContext';
import { cn } from './utils/cn';
import { useState } from 'react';

function AppContent() {
  const { state } = useApp();
  const [showSignup, setShowSignup] = useState(false);

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
    switch (state.currentPage) {
      case 'dashboard':return <Dashboard />;
      case 'employees':return <Employees />;
      case 'attendance':return <Attendance />;
      case 'leaves':return <Leaves />;
      case 'payroll':return <Payroll />;
      case 'recruitment':return <Recruitment />;
      case 'performance':return <Performance />;
      case 'assets':return <Assets />;
      case 'helpdesk':return <HelpDesk />;
      case 'shifts':return <Shifts />;
      case 'tasks':return <Tasks />;
      case 'reports':return <Reports />;
      case 'settings':return <Settings />;
      case 'profile':return <Profile />;
      case 'notifications':return <Notifications />;
      default:return <Dashboard />;
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