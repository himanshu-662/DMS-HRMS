import {
  Download, FileText, Users, Clock,
  DollarSign, Target, TrendingUp } from
'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, LineChart, Line } from
'recharts';
import { cn } from '../utils/cn';
import { useApp } from '../context/AppContext';

const monthlyAttendance = [
  { month: 'Jul', rate: 94.2 },
  { month: 'Aug', rate: 92.8 },
  { month: 'Sep', rate: 95.1 },
  { month: 'Oct', rate: 93.5 },
  { month: 'Nov', rate: 94.8 },
  { month: 'Dec', rate: 91.3 }
];

const departmentHeadcount = [
  { dept: 'Eng', count: 45 },
  { dept: 'Sales', count: 32 },
  { dept: 'Ops', count: 22 },
  { dept: 'Product', count: 20 },
  { dept: 'Mkt', count: 18 },
  { dept: 'Finance', count: 15 },
  { dept: 'HR', count: 12 },
  { dept: 'Design', count: 10 }
];

const leaveAnalytics = [
  { type: 'Casual', count: 45 },
  { type: 'Sick', count: 28 },
  { type: 'Earned', count: 35 },
  { type: 'WFH', count: 62 },
  { type: 'Comp', count: 8 }
];

const attritionData = [
  { month: 'Jul', rate: 2.1 },
  { month: 'Aug', rate: 1.8 },
  { month: 'Sep', rate: 2.5 },
  { month: 'Oct', rate: 1.9 },
  { month: 'Nov', rate: 2.2 },
  { month: 'Dec', rate: 1.6 }
];

const reportCards = [
  { title: 'Attendance Report', description: 'Daily, weekly, and monthly attendance summaries', icon: Clock, color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  { title: 'Payroll Report', description: 'Salary breakdowns, deductions, and net pay', icon: DollarSign, color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  { title: 'Leave Report', description: 'Leave utilization and balance reports', icon: FileText, color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  { title: 'Headcount Report', description: 'Employee count by department and location', icon: Users, color: 'bg-violet-500/10 text-violet-400 border-violet-500/20' },
  { title: 'Performance Report', description: 'Review ratings and goal completion', icon: Target, color: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
  { title: 'Attrition Report', description: 'Employee turnover and retention analytics', icon: TrendingUp, color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' }
];

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6'];

export default function Reports() {
  const { showToast } = useApp();

  const handleExport = (reportName) => {
    showToast('success', 'Export Started', `${reportName} is being generated.`);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Analytical Reports</h1>
          <p className="text-sm text-zinc-500 mt-1">Detailed metrics and trends across all departments.</p>
        </div>
      </div>

      {/* Report Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportCards.map((report) => (
          <div key={report.title} className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 hover:border-zinc-700 transition-all group flex flex-col">
            <div className="flex items-start justify-between mb-6">
              <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center border shadow-inner', report.color)}>
                <report.icon className="w-6 h-6" />
              </div>
              <button
                onClick={() => handleExport(report.title)}
                className="px-3 py-1.5 text-[10px] font-bold text-white bg-zinc-950 border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-all uppercase tracking-wider flex items-center gap-2">
                <Download className="w-3.5 h-3.5" /> Export
              </button>
            </div>
            
            <h4 className="text-sm font-bold text-white group-hover:text-primary-400 transition-colors uppercase tracking-wider">{report.title}</h4>
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider mt-1">{report.description}</p>
          </div>
        ))}
      </div>

      {/* Analytics Visualization Surface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Attendance Rate Trend */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8 shadow-xl">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-8">Attendance Rate Trend</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyAttendance}>
                <defs>
                  <linearGradient id="attendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366F1" stopOpacity={0.1} />
                    <stop offset="100%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="0" stroke="none" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 9, fontWeight: 700, fill: '#71717a' }} axisLine={false} tickLine={false} />
                <YAxis domain={[88, 100]} tick={{ fontSize: 9, fontWeight: 700, fill: '#71717a' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', borderRadius: '0.75rem', border: '1px solid #27272a', padding: '0.75rem' }} 
                  itemStyle={{ color: '#fff', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase' }}
                />
                <Area type="monotone" dataKey="rate" stroke="#6366F1" fill="url(#attendGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Headcount */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8 shadow-xl">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-8">Department Headcount</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentHeadcount}>
                <CartesianGrid strokeDasharray="0" stroke="none" horizontal={false} vertical={false} />
                <XAxis dataKey="dept" tick={{ fontSize: 9, fontWeight: 700, fill: '#71717a' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fontWeight: 700, fill: '#71717a' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                  contentStyle={{ backgroundColor: '#09090b', borderRadius: '0.75rem', border: '1px solid #27272a', padding: '0.75rem' }} 
                  itemStyle={{ color: '#fff', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase' }}
                />
                <Bar dataKey="count" fill="#6366F1" radius={[4, 4, 0, 0]} name="Employees" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leave Analytics */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8 shadow-xl">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-8">Leave Analytics</h3>
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="w-full md:w-1/2 h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={leaveAnalytics} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={5} dataKey="count">
                    {leaveAnalytics.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#09090b', borderRadius: '0.75rem', border: '1px solid #27272a', padding: '0.75rem' }} 
                    itemStyle={{ color: '#fff', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/2 space-y-3">
              {leaveAnalytics.map((item, i) => (
                <div key={item.type} className="flex items-center justify-between p-3 bg-zinc-950 rounded-xl border border-zinc-800/50">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{item.type}</span>
                  </div>
                  <span className="text-xs font-bold text-white">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Attrition Rate */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8 shadow-xl">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-8">Attrition Rate</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attritionData}>
                <CartesianGrid strokeDasharray="0" stroke="none" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 9, fontWeight: 700, fill: '#71717a' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 5]} tick={{ fontSize: 9, fontWeight: 700, fill: '#71717a' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', borderRadius: '0.75rem', border: '1px solid #27272a', padding: '0.75rem' }} 
                  itemStyle={{ color: '#fff', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase' }}
                />
                <Line type="monotone" dataKey="rate" stroke="#ef4444" strokeWidth={2} dot={{ r: 4, fill: '#ef4444', strokeWidth: 0 }} activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2, fill: '#fff' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}


