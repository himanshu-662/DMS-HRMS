import {
  Search, Bell, Moon, Sun, Menu, ChevronDown,
  User, Settings, LogOut, X, Check } from
'lucide-react';
import { cn } from '../utils/cn';
import { useApp } from '../context/AppContext';

import { useState } from 'react';

const pageTitles = {
  dashboard: 'Dashboard',
  employees: 'Employees',
  attendance: 'Attendance',
  leaves: 'Leave management',
  tasks: 'Task Manager',
  payroll: 'Payroll',
  recruitment: 'Recruitment',
  performance: 'Performance',
  assets: 'Assets',
  helpdesk: 'Help desk',
  shifts: 'Shifts',
  reports: 'Reports',
  settings: 'Settings',
  profile: 'My profile'
};

export default function Header() {
  const { state, dispatch, navigateTo, logout } = useApp();
  const { currentPage = 'dashboard', sidebarCollapsed = false, searchQuery = '', notifications = [], currentUser = null } = state;
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    dispatch({ type: 'MARK_ALL_NOTIFICATIONS_READ' });
  };

  const handleNotificationClick = (id) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
  };

  return (
    <header className={cn(
      'fixed top-0 right-0 h-16 bg-zinc-900/60 backdrop-blur-2xl border-b border-zinc-800/50 z-30 flex items-center justify-between px-4 lg:px-8 transition-all duration-300',
      sidebarCollapsed ? 'left-0 lg:left-[80px]' : 'left-0 lg:left-[280px]'
    )}>
      {/* Left: Mobile menu + Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => dispatch({ type: 'TOGGLE_MOBILE_MENU' })}
          className="lg:hidden w-10 h-10 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center hover:bg-zinc-700 transition-all active:scale-95">
          <Menu className="w-5 h-5 text-zinc-300" />
        </button>
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight leading-none">{pageTitles[currentPage]}</h2>
          <p className="text-[10px] text-zinc-500 font-medium mt-1 hidden sm:block">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Center: Search */}
      <div className="hidden md:flex flex-1 max-w-lg mx-12">
        <div className="relative w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-primary-500 transition-colors" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
            className="w-full pl-11 pr-10 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm font-medium focus:outline-none focus:border-primary-500 transition-all text-white placeholder:text-zinc-700" />
          
          {searchQuery &&
          <button
            onClick={() => dispatch({ type: 'SET_SEARCH', payload: '' })}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-zinc-800 rounded-lg transition-colors">
              <X className="w-3.5 h-3.5 text-zinc-500 hover:text-white" />
            </button>
          }
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="w-10 h-10 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center transition-all hover:bg-zinc-900 hover:border-zinc-700 relative active:scale-95 group">
            <Bell className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
            {unreadCount > 0 &&
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary-600 text-white text-[10px] font-black flex items-center justify-center ring-4 ring-zinc-900 animate-pulse">
                {unreadCount}
              </span>
            }
          </button>

          {showNotifications &&
          <div className="absolute right-0 top-14 w-80 sm:w-96 bg-zinc-900 rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border border-zinc-800 animate-scale-in overflow-hidden z-50">
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/30">
                <h3 className="font-bold text-white text-sm">Notifications</h3>
                <button
                onClick={handleMarkAllRead}
                className="text-xs text-primary-500 font-bold hover:text-primary-400">
                  Mark all as read
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="py-12 text-center">
                    <Bell className="w-10 h-10 text-zinc-800 mx-auto mb-3" />
                    <p className="text-xs text-zinc-600 font-bold uppercase tracking-widest">No new alerts</p>
                  </div>
                ) : (
                  notifications.slice(0, 10).map((n) =>
                  <div
                    key={n.id}
                    onClick={() => handleNotificationClick(n.id)}
                    className={cn(
                      'flex items-start gap-4 px-6 py-4 hover:bg-zinc-800/50 transition-colors border-b border-zinc-800/30 last:border-0 cursor-pointer group',
                      !n.read && 'bg-primary-500/[0.03]'
                    )}>
                        <div className={cn(
                      'w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 border transition-all group-hover:scale-110',
                      n.type === 'success' && 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
                      n.type === 'info' && 'bg-primary-500/10 text-primary-500 border-primary-500/20',
                      n.type === 'warning' && 'bg-amber-500/10 text-amber-500 border-amber-500/20',
                      n.type === 'error' && 'bg-red-500/10 text-red-500 border-red-500/20'
                    )}>
                          {n.type === 'success' ? <Check className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-zinc-100">{n.title}</p>
                          <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed">{n.message}</p>
                          <p className="text-[10px] text-zinc-600 mt-2 font-medium">
                            {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        {!n.read && <div className="w-2 h-2 rounded-full bg-primary-500 mt-2 flex-shrink-0 animate-pulse" />}
                      </div>
                  )
                )}
              </div>
              <div className="px-6 py-4 border-t border-zinc-800 text-center">
                <button onClick={() => { dispatch({ type: 'CLEAR_NOTIFICATIONS' }); setShowNotifications(false); }} className="text-xs text-zinc-500 font-bold hover:text-white transition-colors">
                  Clear All
                </button>
              </div>
            </div>
          }
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-3 pl-2 pr-2 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-all active:scale-95 group">
            
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-600 flex items-center justify-center text-white text-xs font-bold shadow-lg">
              {currentUser?.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-white leading-tight">{currentUser?.name.split(' ')[0]}</p>
              <p className="text-[10px] text-zinc-500 font-medium capitalize">{currentUser?.role.replace('_', ' ')}</p>
            </div>
            <ChevronDown className={cn("w-3.5 h-3.5 text-zinc-600 transition-transform", showProfileMenu && "rotate-180")} />
          </button>

          {showProfileMenu &&
          <div className="absolute right-0 top-14 w-64 bg-zinc-900 rounded-2xl shadow-xl border border-zinc-800 overflow-hidden py-2 z-50">
              <div className="px-6 py-4 border-b border-zinc-800 mb-1">
                <p className="text-sm font-bold text-white">{currentUser?.name}</p>
                <p className="text-[10px] text-zinc-500 truncate mt-0.5">{currentUser?.email}</p>
              </div>
              <button
              onClick={() => {
                navigateTo('profile');
                setShowProfileMenu(false);
              }}
              className="w-full flex items-center gap-3 px-6 py-3.5 text-xs font-bold text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-all group">
                <User className="w-4 h-4 group-hover:text-primary-400" /> Account Settings
              </button>
              <button
              onClick={() => {
                navigateTo('settings');
                setShowProfileMenu(false);
              }}
              className="w-full flex items-center gap-3 px-6 py-3 text-xs font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all group">
                <Settings className="w-4 h-4" /> Settings
              </button>
              <div className="border-t border-zinc-800 mt-2 pt-2">
                <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-6 py-3.5 text-xs font-bold text-red-500 hover:bg-red-500/10 transition-all">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            </div>
          }
        </div>
      </div>
    </header>);

}