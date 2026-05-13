import {
  Users, UserCheck, Clock, CalendarX, DollarSign,
  UserPlus, Briefcase, TrendingUp,
  ArrowRight, Calendar, CheckCircle2, XCircle, CheckSquare } from
'lucide-react';
import StatCard from '../components/StatCard';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie, AreaChart, Area } from
'recharts';
import { cn } from '../utils/cn';
import { useApp } from '../context/AppContext';

export default function Dashboard() {
  const { state, dispatch, navigateTo } = useApp();
  const { 
    attendance = [], 
    leaveRequests = [], 
    candidates = [], 
    employees = [], 
    jobPostings = [],
    tasks = []
  } = state;

  const todayPresent = attendance.filter((a) => a.status === 'present' || a.status === 'wfh').length;
  const lateCount = attendance.filter((a) => a.status === 'late').length;
  const leaveToday = attendance.filter((a) => a.status === 'absent').length;

  const pendingLeaves = leaveRequests.filter((l) => l.status === 'pending');

  const deptDistribution = [
    { name: 'Engineering', value: 45, color: '#6366F1' },
    { name: 'Sales', value: 32, color: '#10B981' },
    { name: 'Marketing', value: 24, color: '#F59E0B' },
    { name: 'Operations', value: 18, color: '#EC4899' }
  ];

  const handleApproveLeave = (id) => {
    dispatch({ type: 'APPROVE_LEAVE', payload: id });
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: Date.now().toString(),
        title: 'Leave approved',
        message: 'Leave request has been approved successfully.',
        type: 'success',
        read: false,
        timestamp: new Date().toISOString()
      }
    });
  };

  const handleRejectLeave = (id) => {
    dispatch({ type: 'REJECT_LEAVE', payload: id });
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total employees" value={employees.length} icon={Users} trend="+4.5%" color="indigo" />
        <StatCard title="Present today" value={todayPresent} icon={UserCheck} trend="+12%" color="emerald" />
        <StatCard title="Late today" value={lateCount} icon={Clock} trend="-2%" color="orange" />
        <StatCard title="On leave" value={leaveToday} icon={CalendarX} trend="+5%" color="red" />
      </div>

      {/* Middle Row: Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Attendance trend</h3>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-zinc-950 border border-zinc-800 rounded-lg text-[10px] font-bold text-zinc-500 uppercase">last 7 days</span>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={deptDistribution}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#18181b" vertical={false} />
                <XAxis dataKey="name" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="value" stroke="#6366F1" fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-xl flex flex-col">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-8">Department share</h3>
          <div className="flex-1 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={deptDistribution} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {deptDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <p className="text-[9px] font-bold text-zinc-500 uppercase">total</p>
              <p className="text-2xl font-bold text-white leading-tight">{employees.length}</p>
            </div>
          </div>
          <div className="mt-6 space-y-2.5">
            {deptDistribution.map((d) => (
              <div key={d.name} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-[10px] font-bold text-zinc-400 group-hover:text-white transition-colors uppercase">{d.name}</span>
                </div>
                <span className="text-[10px] font-bold text-white bg-zinc-950 px-2 py-0.5 rounded-md border border-zinc-800">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Approvals */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Pending approvals</h3>
            <button onClick={() => navigateTo('leaves')} className="text-[10px] font-bold text-primary-500 hover:text-primary-400 uppercase tracking-widest">View all</button>
          </div>
          <div className="space-y-4">
            {pendingLeaves.length === 0 ? (
              <div className="py-12 text-center border border-dashed border-zinc-800 rounded-2xl">
                <CheckCircle2 className="w-10 h-10 text-zinc-800 mx-auto mb-4" />
                <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">all caught up</p>
              </div>
            ) : (
              pendingLeaves.slice(0, 3).map((leave) => (
                <div key={leave.id} className="p-5 bg-zinc-950/50 rounded-2xl border border-zinc-800 group hover:border-zinc-700 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white text-xs font-black uppercase">
                        {leave?.employeeName?.split(' ').map((n) => n[0]).join('') || '?'}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{leave?.employeeName || 'Unknown'}</p>
                        <p className="text-[10px] text-zinc-500 uppercase mt-0.5">{leave?.type || 'General'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-white">{leave.days} days</p>
                      <p className="text-[9px] text-zinc-600 font-bold mt-1 uppercase">{new Date(leave.startDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleApproveLeave(leave.id)} className="flex-1 py-2.5 bg-emerald-600/10 text-emerald-500 text-[10px] font-bold rounded-xl hover:bg-emerald-600 hover:text-white transition-all border border-emerald-600/20 uppercase tracking-widest">approve</button>
                    <button onClick={() => handleRejectLeave(leave.id)} className="flex-1 py-2.5 bg-rose-600/10 text-rose-500 text-[10px] font-bold rounded-xl hover:bg-rose-600 hover:text-white transition-all border border-rose-600/20 uppercase tracking-widest">reject</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recent tasks</h3>
            <button onClick={() => navigateTo('tasks')} className="text-[10px] font-bold text-primary-500 hover:text-primary-400 uppercase tracking-widest">View all</button>
          </div>
          <div className="space-y-4">
            {tasks.filter(t => t.status !== 'completed').length === 0 ? (
              <div className="py-12 text-center border border-dashed border-zinc-800 rounded-2xl">
                <CheckSquare className="w-10 h-10 text-zinc-800 mx-auto mb-4" />
                <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">no active tasks</p>
              </div>
            ) : (
              tasks.filter(t => t.status !== 'completed').slice(0, 3).map((task) => (
                <div key={task.id} className="p-5 bg-zinc-950/50 rounded-2xl border border-zinc-800 group hover:border-zinc-700 transition-all flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center border",
                      task.priority === 'high' ? "bg-rose-500/10 border-rose-500/20 text-rose-500" : 
                      task.priority === 'medium' ? "bg-amber-500/10 border-amber-500/20 text-amber-500" :
                      "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                    )}>
                      <CheckSquare className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate">{task.title}</p>
                      <p className="text-[10px] text-zinc-500 mt-1 uppercase font-bold">{task.assignee || 'Unassigned'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">{task.dueDate}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-zinc-900 rounded-[2.5rem] border border-zinc-800 p-8 shadow-xl">
        <h3 className="text-sm font-bold text-white mb-8 uppercase tracking-wider">Quick actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Employees', icon: UserPlus, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', page: 'employees' },
            { label: 'Attendance', icon: Clock, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', page: 'attendance' },
            { label: 'Leaves', icon: Calendar, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', page: 'leaves' },
            { label: 'Payroll', icon: DollarSign, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20', page: 'payroll' },
            { label: 'Hiring', icon: Briefcase, color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20', page: 'recruitment' },
            { label: 'Reports', icon: TrendingUp, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', page: 'reports' }
          ].map((action) => (
            <button
              key={action.label}
              onClick={() => navigateTo(action.page)}
              className="flex flex-col items-center gap-4 p-6 rounded-3xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 transition-all group">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center border transition-transform group-hover:scale-110", action.bg, action.color, action.border)}>
                <action.icon className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-bold text-zinc-500 group-hover:text-white transition-colors text-center uppercase tracking-widest leading-tight">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}