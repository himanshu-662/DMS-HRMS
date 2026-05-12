import {
  LayoutDashboard, Users, Clock, CalendarDays, DollarSign,
  UserPlus, Target, Package, HelpCircle, CalendarClock,
  BarChart3, Settings, ChevronLeft, ChevronRight, Zap, X
} from 'lucide-react';
import type { PageType } from '../types';
import { cn } from '../utils/cn';
import { useApp } from '../context/AppContext';

const menuItems: { id: PageType; label: string; icon: React.ElementType; roles?: string[] }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'employees', label: 'Employees', icon: Users, roles: ['hr_admin', 'super_admin', 'manager'] },
  { id: 'attendance', label: 'Attendance', icon: Clock },
  { id: 'leaves', label: 'Leaves', icon: CalendarDays },
  { id: 'shifts', label: 'Shifts', icon: CalendarClock, roles: ['hr_admin', 'super_admin', 'manager'] },
  { id: 'payroll', label: 'Payroll', icon: DollarSign, roles: ['hr_admin', 'super_admin'] },
  { id: 'recruitment', label: 'Recruitment', icon: UserPlus, roles: ['hr_admin', 'super_admin', 'recruiter', 'manager'] },
  { id: 'performance', label: 'Performance', icon: Target },
  { id: 'assets', label: 'Assets', icon: Package },
  { id: 'helpdesk', label: 'Help Desk', icon: HelpCircle },
  { id: 'reports', label: 'Reports', icon: BarChart3, roles: ['hr_admin', 'super_admin', 'manager'] },
  { id: 'settings', label: 'Settings', icon: Settings, roles: ['hr_admin', 'super_admin'] },
];

export default function Sidebar() {
  const { state, dispatch, navigateTo } = useApp();
  const { currentPage, sidebarCollapsed, mobileMenuOpen, leaveRequests, tickets, candidates, currentUser } = state;
  
  const pendingLeaves = leaveRequests.filter(l => l.status === 'pending').length;
  const openTickets = tickets.filter(t => t.status === 'open').length;
  const newCandidates = candidates.filter(c => c.stage === 'applied').length;

  const filteredMenuItems = menuItems.filter(item => {
    if (!item.roles) return true;
    return currentUser && item.roles.includes(currentUser.role);
  });

  const getBadge = (id: PageType): number | undefined => {
    if (id === 'leaves' && pendingLeaves > 0) return pendingLeaves;
    if (id === 'helpdesk' && openTickets > 0) return openTickets;
    if (id === 'recruitment' && newCandidates > 0) return newCandidates;
    return undefined;
  };

  return (
    <>
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => dispatch({ type: 'TOGGLE_MOBILE_MENU' })}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 h-full bg-sidebar text-white z-50 flex flex-col transition-all duration-300 ease-in-out',
          sidebarCollapsed ? 'w-[72px]' : 'w-[260px]',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className={cn(
          'flex items-center h-16 px-4 border-b border-white/10',
          sidebarCollapsed ? 'justify-center' : 'justify-between'
        )}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
              <Zap className="w-5 h-5 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div className="animate-fade-in">
                <h1 className="text-lg font-bold tracking-tight">DMS HRMS</h1>
                <p className="text-[10px] text-primary-300 -mt-0.5 font-medium uppercase tracking-wider">{state.settings.company_name || 'HR Platform'}</p>
              </div>
            )}
          </div>
          <button
            onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
            className="hidden lg:flex w-7 h-7 rounded-lg hover:bg-white/10 items-center justify-center transition-colors"
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
          <button
            onClick={() => dispatch({ type: 'TOGGLE_MOBILE_MENU' })}
            className="lg:hidden w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-2.5">
          <div className="space-y-0.5">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              const badge = getBadge(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative',
                    isActive
                      ? 'bg-sidebar-active text-white shadow-lg shadow-primary-700/30'
                      : 'text-white/70 hover:bg-sidebar-hover hover:text-white',
                    sidebarCollapsed && 'justify-center px-0'
                  )}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <Icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'text-primary-300')} />
                  {!sidebarCollapsed && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      {badge !== undefined && (
                        <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-danger-500 text-white text-[11px] font-semibold flex items-center justify-center">
                          {badge}
                        </span>
                      )}
                    </>
                  )}
                  {sidebarCollapsed && badge !== undefined && (
                    <span className="absolute -top-1 -right-1 min-w-[16px] h-4 rounded-full bg-danger-500 text-white text-[10px] font-semibold flex items-center justify-center">
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {!sidebarCollapsed && currentUser && (
          <div className="p-3 border-t border-white/10">
            <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-white/5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-500 flex items-center justify-center text-sm font-bold shadow-inner">
                {currentUser.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{currentUser.name}</p>
                <p className="text-[10px] text-white/50 uppercase tracking-widest font-semibold">{currentUser.role.replace('_', ' ')}</p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
