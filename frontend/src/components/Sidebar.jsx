import { 
  LayoutDashboard, Users, Clock, CalendarDays, CalendarClock, DollarSign, 
  UserPlus, Target, Package, HelpCircle, BarChart3, Settings, 
  ChevronLeft, ChevronRight, Zap, X, Bell, CheckSquare,
  Building, Database, ShieldCheck, Activity, CreditCard, Ticket, FileText
} from 'lucide-react'; 

import { cn } from '../utils/cn';
import { useApp } from '../context/AppContext';

const roleMenus = {
  hr_admin: [
    {
      title: 'Core',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'notifications', label: 'Notifications', icon: Bell },
      ]
    },
    {
      title: 'Management',
      items: [
        { id: 'employees', label: 'Employee Management', icon: Users },
        { id: 'attendance', label: 'Attendance', icon: Clock },
        { id: 'leaves', label: 'Leave Management', icon: CalendarDays },
        { id: 'shifts', label: 'Shifts', icon: CalendarClock },
        { id: 'tasks', label: 'Workflow Automation', icon: CheckSquare },
      ]
    },
    {
      title: 'Finance & Planning',
      items: [
        { id: 'payroll', label: 'Payroll', icon: DollarSign },
        { id: 'recruitment', label: 'Recruitment', icon: UserPlus },
        { id: 'performance', label: 'Performance', icon: Target },
        { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
      ]
    },
    {
      title: 'Resources',
      items: [
        { id: 'assets', label: 'Asset Management', icon: Package },
        { id: 'helpdesk', label: 'Help Desk', icon: HelpCircle },
      ]
    },
    {
      title: 'System',
      items: [
        { id: 'settings', label: 'Organization Settings', icon: Settings }
      ]
    }
  ],
  manager: [
    {
      title: 'Core',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'notifications', label: 'Notifications', icon: Bell },
      ]
    },
    {
      title: 'Team Management',
      items: [
        { id: 'employees', label: 'Team Members', icon: Users },
        { id: 'attendance', label: 'Attendance', icon: Clock },
        { id: 'leaves', label: 'Leave Approvals', icon: CalendarDays },
        { id: 'tasks', label: 'Team Tasks', icon: CheckSquare },
      ]
    },
    {
      title: 'Planning',
      items: [
        { id: 'performance', label: 'Team Performance', icon: Target },
        { id: 'reports', label: 'Team Reports', icon: BarChart3 },
      ]
    },
    {
      title: 'System',
      items: [
        { id: 'settings', label: 'Profile Settings', icon: Settings }
      ]
    }
  ],
  employee: [
    {
      title: 'Core',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'notifications', label: 'Notifications', icon: Bell },
      ]
    },
    {
      title: 'Self Service',
      items: [
        { id: 'attendance', label: 'My Attendance', icon: Clock },
        { id: 'leaves', label: 'Apply Leave', icon: CalendarDays },
        { id: 'payroll', label: 'My Payroll', icon: DollarSign },
        { id: 'tasks', label: 'My Tasks', icon: CheckSquare },
      ]
    },
    {
      title: 'Growth',
      items: [
        { id: 'performance', label: 'My Performance', icon: Target },
      ]
    },
    {
      title: 'Resources',
      items: [
        { id: 'helpdesk', label: 'Help Desk', icon: HelpCircle },
      ]
    },
    {
      title: 'System',
      items: [
        { id: 'settings', label: 'Profile Settings', icon: Settings }
      ]
    }
  ],
  super_admin: [
    {
      title: 'Core',
      items: [
        { id: 'super-admin-dashboard', label: 'Global Dashboard', icon: LayoutDashboard },
        { id: 'notifications', label: 'Notifications', icon: Bell },
      ]
    },
    {
      title: 'SaaS Management',
      items: [
        { id: 'organizations', label: 'Organizations', icon: Building },
        { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
        { id: 'billing', label: 'Billing & Revenue', icon: DollarSign },
      ]
    },
    {
      title: 'Platform Analytics',
      items: [
        { id: 'analytics', label: 'Usage Insights', icon: BarChart3 },
        { id: 'reports', label: 'Global Reports', icon: FileText },
      ]
    },
    {
      title: 'System & Security',
      items: [
        { id: 'monitoring', label: 'System Health', icon: Activity },
        { id: 'database', label: 'Database', icon: Database },
        { id: 'audit-logs', label: 'Audit Logs', icon: ShieldCheck },
      ]
    },
    {
      title: 'Support',
      items: [
        { id: 'tickets', label: 'Support Tickets', icon: Ticket },
        { id: 'help', label: 'Documentation', icon: HelpCircle },
      ]
    },
    {
      title: 'System',
      items: [
        { id: 'settings', label: 'Platform Settings', icon: Settings }
      ]
    }
  ]
};


export default function Sidebar() {
  const { state, dispatch, navigateTo } = useApp();
  const { 
    currentPage = 'dashboard', sidebarCollapsed = false, mobileMenuOpen = false, 
    leaveRequests = [], tickets = [], candidates = [], currentUser = null, notifications = [], tasks = [] 
  } = state;

  const pendingLeaves = (leaveRequests || []).filter((l) => l.status === 'pending').length;
  const openTickets = (tickets || []).filter((t) => t.status === 'open').length;
  const newCandidates = (candidates || []).filter((c) => c.stage === 'applied').length;
  const pendingTasks = (tasks || []).filter((t) => t.status !== 'completed').length;
  const unreadNotifications = (notifications || []).filter(n => !n.read).length;

  const getBadge = (id) => {
    if (id === 'leaves' && pendingLeaves > 0) return pendingLeaves;
    if (id === 'helpdesk' && openTickets > 0) return openTickets;
    if (id === 'recruitment' && newCandidates > 0) return newCandidates;
    if (id === 'tasks' && pendingTasks > 0) return pendingTasks;
    if (id === 'notifications' && unreadNotifications > 0) return unreadNotifications;
    return undefined;
  };


  const menuSections = roleMenus[currentUser?.role] || roleMenus.employee;

  return (
    <>
      {mobileMenuOpen &&
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={() => dispatch({ type: 'TOGGLE_MOBILE_MENU' })} />

      }

      <aside
        className={cn(
          'fixed top-0 left-0 h-full bg-zinc-950 text-white z-50 flex flex-col transition-all duration-300 ease-in-out border-r border-zinc-900/50 shadow-[20px_0_40px_-15px_rgba(0,0,0,0.5)]',
          sidebarCollapsed ? 'w-[80px]' : 'w-[280px]',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}>
        
        <div className={cn(
          'flex items-center h-16 px-6 border-b border-zinc-900/50',
          sidebarCollapsed ? 'justify-center' : 'justify-between'
        )}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center shadow-xl overflow-hidden active:scale-90 transition-transform cursor-pointer group">
              {currentUser?.organization?.logo ? (
                <img src={currentUser.organization.logo} alt="" className="w-full h-full object-contain p-1" />
              ) : (
                <Zap className="w-5 h-5 text-indigo-500 fill-indigo-500/20 group-hover:scale-110 transition-transform" />
              )}
            </div>
            {!sidebarCollapsed &&
            <div className="animate-fade-in">
                <h1 className="text-lg font-bold text-white text-ellipsis overflow-hidden whitespace-nowrap">
                  {currentUser?.organization?.company_name || state.settings?.company_name || 'DMS HRMS'}
                </h1>
                <p className="text-[10px] text-zinc-500 font-medium">HR Management</p>
              </div>
            }
          </div>
          <button
            onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
            className="hidden lg:flex w-8 h-8 rounded-xl hover:bg-zinc-900 border border-transparent hover:border-zinc-800 items-center justify-center transition-all group">
            
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-white" /> : <ChevronLeft className="w-4 h-4 text-zinc-500 group-hover:text-white" />}
          </button>
          <button
            onClick={() => dispatch({ type: 'TOGGLE_MOBILE_MENU' })}
            className="lg:hidden w-8 h-8 rounded-xl hover:bg-zinc-900 flex items-center justify-center">
            
            <X className="w-4 h-4 text-zinc-500" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
          <div className="space-y-8">
            {menuSections.map((section) => (
              <div key={section.title} className="space-y-1.5">
                {!sidebarCollapsed && (
                  <h3 className="px-4 text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-3">
                    {section.title}
                  </h3>
                )}
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  const badge = getBadge(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => navigateTo(item.id)}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 relative group overflow-hidden',
                        isActive ?
                        'bg-primary-600/10 text-primary-400 shadow-[inset_0_0_20px_rgba(37,99,235,0.05)]' :
                        'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/50',
                        sidebarCollapsed && 'justify-center px-0'
                      )}
                      title={sidebarCollapsed ? item.label : undefined}>
                      
                      {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-500 rounded-r-full shadow-[0_0_15px_rgba(37,99,235,1)]" />}
                      
                      <Icon className={cn('w-5 h-5 flex-shrink-0 transition-all', isActive ? 'text-primary-400' : 'text-inherit')} />
                      {!sidebarCollapsed &&
                      <>
                          <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
                          {badge !== undefined &&
                        <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-primary-600 text-white text-[10px] font-bold flex items-center justify-center">
                              {badge}
                            </span>
                        }
                        </>
                      }
                      {sidebarCollapsed && badge !== undefined &&
                      <span className="absolute top-2 right-2 min-w-[16px] h-4 rounded-full bg-primary-500 text-white text-[9px] font-black flex items-center justify-center ring-2 ring-zinc-950">
                          {badge}
                        </span>
                      }
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </nav>

        {currentUser &&
        <div className={cn("p-4 border-t border-zinc-900/50 bg-zinc-950/50", sidebarCollapsed ? "flex justify-center" : "")}>
            <div className={cn("flex items-center gap-3 p-3 rounded-2xl bg-zinc-900/30 border border-zinc-800/50 group hover:border-zinc-700 transition-colors cursor-pointer", sidebarCollapsed ? "w-12 h-12 p-0 justify-center" : "")}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-black shadow-lg group-hover:rotate-6 transition-transform overflow-hidden">
                {currentUser?.avatar ? (
                  <img src={currentUser.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  currentUser.name.split(' ').map((n) => n[0]).join('')
                )}
              </div>
              {!sidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate text-white">{currentUser.name}</p>
                  <p className="text-[10px] text-zinc-500 capitalize mt-0.5">{currentUser.role.replace('_', ' ')}</p>
                </div>
              )}
            </div>
          </div>
        }
      </aside>
    </>);

}