import { Download, FileText, Users, Clock, DollarSign, Target, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, LineChart, Line } from 'recharts';
import { cn } from '../utils/cn';
import { useApp } from '../context/AppContext';
const monthlyAttendance = [
    { month: 'Jul', rate: 94.2 },
    { month: 'Aug', rate: 92.8 },
    { month: 'Sep', rate: 95.1 },
    { month: 'Oct', rate: 93.5 },
    { month: 'Nov', rate: 94.8 },
    { month: 'Dec', rate: 91.3 },
];
const departmentHeadcount = [
    { dept: 'Eng', count: 45 },
    { dept: 'Sales', count: 32 },
    { dept: 'Ops', count: 22 },
    { dept: 'Product', count: 20 },
    { dept: 'Mkt', count: 18 },
    { dept: 'Finance', count: 15 },
    { dept: 'HR', count: 12 },
    { dept: 'Design', count: 10 },
];
const leaveAnalytics = [
    { type: 'Casual', count: 45 },
    { type: 'Sick', count: 28 },
    { type: 'Earned', count: 35 },
    { type: 'WFH', count: 62 },
    { type: 'Comp', count: 8 },
];
const attritionData = [
    { month: 'Jul', rate: 2.1 },
    { month: 'Aug', rate: 1.8 },
    { month: 'Sep', rate: 2.5 },
    { month: 'Oct', rate: 1.9 },
    { month: 'Nov', rate: 2.2 },
    { month: 'Dec', rate: 1.6 },
];
const reportCards = [
    { title: 'Attendance Report', description: 'Daily, weekly, and monthly attendance summaries', icon: Clock, color: 'bg-blue-50 text-blue-600' },
    { title: 'Payroll Report', description: 'Salary breakdowns, deductions, and net pay', icon: DollarSign, color: 'bg-green-50 text-green-600' },
    { title: 'Leave Report', description: 'Leave utilization and balance reports', icon: FileText, color: 'bg-orange-50 text-orange-600' },
    { title: 'Headcount Report', description: 'Employee count by department and location', icon: Users, color: 'bg-violet-50 text-violet-600' },
    { title: 'Performance Report', description: 'Review ratings and goal completion', icon: Target, color: 'bg-pink-50 text-pink-600' },
    { title: 'Attrition Report', description: 'Employee turnover and retention analytics', icon: TrendingUp, color: 'bg-cyan-50 text-cyan-600' },
];
const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6'];
export default function Reports() {
    const { showToast } = useApp();
    const handleExport = (reportName) => {
        showToast('success', 'Export Started', `${reportName} export is being prepared.`);
    };
    return (<div className="space-y-6 animate-fade-in">
      {/* Report Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportCards.map(report => (<div key={report.title} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:shadow-gray-100/50 transition-all group cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', report.color)}>
                <report.icon className="w-5 h-5"/>
              </div>
              <button onClick={() => handleExport(report.title)} className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100">
                <Download className="w-3 h-3"/> Export
              </button>
            </div>
            <h4 className="text-sm font-semibold text-gray-900">{report.title}</h4>
            <p className="text-xs text-gray-500 mt-1">{report.description}</p>
          </div>))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trend */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-1">Attendance Rate Trend</h3>
          <p className="text-xs text-gray-500 mb-4">Monthly attendance rate percentage</p>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={monthlyAttendance}>
              <defs>
                <linearGradient id="attendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366F1" stopOpacity={0.2}/>
                  <stop offset="100%" stopColor="#6366F1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6"/>
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false}/>
              <YAxis domain={[88, 100]} tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`}/>
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb' }} formatter={(v) => [`${v}%`, 'Rate']}/>
              <Area type="monotone" dataKey="rate" stroke="#6366F1" fill="url(#attendGrad)" strokeWidth={2.5}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Department Headcount */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-1">Department Headcount</h3>
          <p className="text-xs text-gray-500 mb-4">Employee distribution by department</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={departmentHeadcount}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6"/>
              <XAxis dataKey="dept" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb' }}/>
              <Bar dataKey="count" fill="#6366F1" radius={[6, 6, 0, 0]} name="Employees"/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Leave Analytics */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-1">Leave Analytics</h3>
          <p className="text-xs text-gray-500 mb-4">Leave distribution by type</p>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie data={leaveAnalytics} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="count">
                  {leaveAnalytics.map((_, i) => (<Cell key={i} fill={COLORS[i % COLORS.length]}/>))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb' }}/>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {leaveAnalytics.map((item, i) => (<div key={item.type} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}/>
                    <span className="text-gray-600">{item.type}</span>
                  </div>
                  <span className="font-semibold text-gray-900">{item.count}</span>
                </div>))}
            </div>
          </div>
        </div>

        {/* Attrition Rate */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-1">Attrition Rate</h3>
          <p className="text-xs text-gray-500 mb-4">Monthly employee turnover percentage</p>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={attritionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6"/>
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false}/>
              <YAxis domain={[0, 5]} tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`}/>
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb' }} formatter={(v) => [`${v}%`, 'Rate']}/>
              <Line type="monotone" dataKey="rate" stroke="#EF4444" strokeWidth={2.5} dot={{ r: 4, fill: '#EF4444' }}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>);
}
