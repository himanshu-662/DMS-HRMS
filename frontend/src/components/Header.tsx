import {
  Search, Bell, Moon, Sun, Menu, ChevronDown,
  User, Settings, LogOut, X, Check
} from 'lucide-react';
import { cn } from '../utils/cn';
import { useApp } from '../context/AppContext';
import type { PageType } from '../types';
import { useState } from 'react';

const pageTitles: Record<PageType, string> = {
  dashboard: 'Dashboard',
  employees: 'Employee Management',
  attendance: 'Attendance Tracking',
  leaves: 'Leave Management',
  payroll: 'Payroll Management',
  recruitment: 'Recruitment & ATS',
  performance: 'Performance Management',
  assets: 'Asset Management',
  helpdesk: 'Help Desk',
  shifts: 'Shift Scheduling',
  reports: 'Reports & Analytics',
  settings: 'Settings',
  profile: 'My Profile',
};

export default function Header() {
  const { state, dispatch, navigateTo, logout } = useApp();
  const { currentPage, sidebarCollapsed, searchQuery, notifications, currentUser } = state;
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    dispatch({ type: 'MARK_ALL_NOTIFICATIONS_READ' });
  };

  const handleNotificationClick = (id: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
  };

  return (
    <header className={cn(
      'fixed top-0 right-0 h-16 bg-white/80 backdrop-blur-xl border-b border-gray-200/60 z-30 flex items-center justify-between px-4 lg:px-6 transition-all duration-300',
      sidebarCollapsed ? 'left-0 lg:left-[72px]' : 'left-0 lg:left-[260px]'
    )}>
      {/* Left: Mobile menu + Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => dispatch({ type: 'TOGGLE_MOBILE_MENU' })}
          className="lg:hidden w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h2 className="text-lg font-bold text-gray-900">{pageTitles[currentPage]}</h2>
          <p className="text-xs text-gray-500 hidden sm:block">
            Welcome back, {currentUser?.name.split(' ')[0]} 👋
          </p>
        </div>
      </div>

      {/* Center: Search */}
      <div className="hidden md:flex flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search employees, records, reports..."
            value={searchQuery}
            onChange={e => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl text-sm border-0 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => dispatch({ type: 'SET_SEARCH', payload: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
          className="w-9 h-9 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
        >
          {state.darkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-gray-600" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center transition-colors relative"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-danger-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 animate-scale-in overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                <button 
                  onClick={handleMarkAllRead}
                  className="text-xs text-primary-600 font-medium hover:text-primary-700"
                >
                  Mark all read
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.slice(0, 10).map(n => (
                  <div
                    key={n.id}
                    onClick={() => handleNotificationClick(n.id)}
                    className={cn(
                      'flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 cursor-pointer',
                      !n.read && 'bg-primary-50/50'
                    )}
                  >
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0',
                      n.type === 'success' && 'bg-success-50 text-success-600',
                      n.type === 'info' && 'bg-primary-50 text-primary-600',
                      n.type === 'warning' && 'bg-warning-50 text-warning-600',
                      n.type === 'error' && 'bg-danger-50 text-danger-600',
                    )}>
                      {n.type === 'success' ? <Check className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{n.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {new Date(n.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {!n.read && <div className="w-2 h-2 rounded-full bg-primary-500 mt-2 flex-shrink-0" />}
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 border-t border-gray-100 text-center">
                <button className="text-xs text-primary-600 font-medium hover:text-primary-700">
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-500 flex items-center justify-center text-white text-xs font-bold">
              {currentUser?.name.split(' ').map(n => n[0]).join('')}
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:block">
              {currentUser?.name.split(' ')[0]}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 animate-scale-in overflow-hidden py-1">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900">{currentUser?.name}</p>
                <p className="text-xs text-gray-500">{currentUser?.email}</p>
              </div>
              <button
                onClick={() => {
                  navigateTo('profile');
                  setShowProfileMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <User className="w-4 h-4" /> My Profile
              </button>
              <button
                onClick={() => {
                  navigateTo('settings');
                  setShowProfileMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Settings className="w-4 h-4" /> Settings
              </button>
              <div className="border-t border-gray-100 mt-1 pt-1">
                <button 
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-danger-600 hover:bg-danger-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
