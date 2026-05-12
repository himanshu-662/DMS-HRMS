import {
  Users, UserCheck, Clock, CalendarX, DollarSign,
  UserPlus, Briefcase, TrendingUp,
  ArrowRight, Calendar, CheckCircle2, XCircle } from
'lucide-react';
import StatCard from '../components/StatCard';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, LineChart, Line } from
'recharts';
import { useApp } from '../context/AppContext';

const attendanceChartData = [
{ day: 'Mon', present: 152, absent: 8, late: 5, wfh: 15 },
{ day: 'Tue', present: 148, absent: 12, late: 8, wfh: 12 },
{ day: 'Wed', present: 155, absent: 5, late: 3, wfh: 17 },
{ day: 'Thu', present: 150, absent: 10, late: 6, wfh: 14 },
{ day: 'Fri', present: 145, absent: 15, late: 4, wfh: 16 }];


const deptDistribution = [
{ name: 'Engineering', value: 45, color: '#6366F1' },
{ name: 'Sales', value: 32, color: '#10B981' },
{ name: 'Product', value: 20, color: '#F59E0B' },
{ name: 'Marketing', value: 18, color: '#EC4899' },
{ name: 'Finance', value: 15, color: '#8B5CF6' },
{ name: 'Design', value: 10, color: '#06B6D4' },
{ name: 'HR', value: 12, color: '#F97316' },
{ name: 'Ops', value: 22, color: '#14B8A6' }];


const hiringTrend = [
{ month: 'Jul', hires: 5, applications: 45 },
{ month: 'Aug', hires: 8, applications: 62 },
{ month: 'Sep', hires: 4, applications: 38 },
{ month: 'Oct', hires: 7, applications: 55 },
{ month: 'Nov', hires: 6, applications: 48 },
{ month: 'Dec', hires: 3, applications: 42 }];


const payrollTrend = [
{ month: 'Jul', amount: 1250000 },
{ month: 'Aug', amount: 1280000 },
{ month: 'Sep', amount: 1310000 },
{ month: 'Oct', amount: 1295000 },
{ month: 'Nov', amount: 1340000 },
{ month: 'Dec', amount: 1360000 }];


export default function Dashboard() {
  const { state, dispatch, navigateTo, showToast } = useApp();
  const { attendance, leaveRequests, candidates, employees, jobPostings } = state;

  const todayPresent = attendance.filter((a) => a.status === 'present' || a.status === 'wfh').length;
  const pendingLeaves = leaveRequests.filter((l) => l.status === 'pending');
  const openPositions = jobPostings.filter((j) => j.status === 'open').length;

  const handleApproveLeave = (id) => {
    dispatch({ type: 'APPROVE_LEAVE', payload: id });
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: Date.now().toString(),
        title: 'Leave Approved',
        message: 'Leave request has been approved successfully.',
        type: 'success',
        read: false,
        timestamp: new Date().toISOString()
      }
    });
    showToast('success', 'Leave Approved', 'The leave request has been approved.');
  };

  const handleRejectLeave = (id) => {
    dispatch({ type: 'REJECT_LEAVE', payload: id });
    showToast('info', 'Leave Rejected', 'The leave request has been rejected.');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Employees" value={employees.length} change={3.2} icon={Users} color="blue" />
        <StatCard title="Present Today" value={todayPresent} change={-1.5} icon={UserCheck} color="green" subtitle={`${Math.round(todayPresent / Math.max(employees.length, 1) * 100)}% attendance rate`} />
        <StatCard title="Pending Leaves" value={pendingLeaves.length} icon={CalendarX} color="orange" subtitle="Awaiting approval" />
        <StatCard title="Open Positions" value={openPositions} change={12} icon={Briefcase} color="purple" />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Trend */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-gray-900">Weekly Attendance Overview</h3>
              <p className="text-xs text-gray-500 mt-0.5">This week's attendance breakdown</p>
            </div>
            <button onClick={() => navigateTo('attendance')} className="text-xs text-primary-600 font-medium hover:text-primary-700 flex items-center gap-1">
              View Details <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={attendanceChartData} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              
              <Bar dataKey="present" name="Present" fill="#6366F1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="wfh" name="WFH" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="late" name="Late" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              <Bar dataKey="absent" name="Absent" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Department Distribution */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="text-base font-semibold text-gray-900">Department Distribution</h3>
          <p className="text-xs text-gray-500 mt-0.5">Employees by department</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={deptDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                {deptDistribution.map((entry, i) =>
                <Cell key={i} fill={entry.color} />
                )}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-1.5 mt-2">
            {deptDistribution.map((d) =>
            <div key={d.name} className="flex items-center gap-1.5 text-xs">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                <span className="text-gray-600 truncate">{d.name}</span>
                <span className="text-gray-400 ml-auto">{d.value}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payroll Trend */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-gray-900">Payroll Trend</h3>
              <p className="text-xs text-gray-500 mt-0.5">Monthly payroll expenditure</p>
            </div>
            <button onClick={() => navigateTo('payroll')} className="text-xs text-primary-600 font-medium hover:text-primary-700 flex items-center gap-1">
              View Details <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={payrollTrend}>
              <defs>
                <linearGradient id="payrollGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366F1" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb' }} formatter={(v) => [`$${Number(v).toLocaleString()}`, 'Payroll']} />
              <Area type="monotone" dataKey="amount" stroke="#6366F1" fill="url(#payrollGrad)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Hiring Trend */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-gray-900">Hiring Pipeline</h3>
              <p className="text-xs text-gray-500 mt-0.5">Applications vs hires</p>
            </div>
            <button onClick={() => navigateTo('recruitment')} className="text-xs text-primary-600 font-medium hover:text-primary-700 flex items-center gap-1">
              View Details <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={hiringTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb' }} />
              <Line type="monotone" dataKey="applications" stroke="#6366F1" strokeWidth={2.5} dot={{ r: 4, fill: '#6366F1' }} name="Applications" />
              <Line type="monotone" dataKey="hires" stroke="#10B981" strokeWidth={2.5} dot={{ r: 4, fill: '#10B981' }} name="Hires" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row: Recent Activities + Pending Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Leave Requests */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-900">Pending Leave Requests</h3>
            <button onClick={() => navigateTo('leaves')} className="text-xs text-primary-600 font-medium hover:text-primary-700 flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {pendingLeaves.length === 0 ?
            <p className="text-sm text-gray-500 text-center py-4">No pending leave requests</p> :

            pendingLeaves.slice(0, 4).map((leave) =>
            <div key={leave.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/80 hover:bg-gray-100/80 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {leave.employeeName.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{leave.employeeName}</p>
                    <p className="text-xs text-gray-500">{leave.type.replace('_', ' ').toUpperCase()} · {leave.days} day{leave.days > 1 ? 's' : ''}</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                  onClick={() => handleApproveLeave(leave.id)}
                  className="w-7 h-7 rounded-lg bg-success-50 text-success-600 flex items-center justify-center hover:bg-success-500 hover:text-white transition-colors">
                  
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                    <button
                  onClick={() => handleRejectLeave(leave.id)}
                  className="w-7 h-7 rounded-lg bg-danger-50 text-danger-600 flex items-center justify-center hover:bg-danger-500 hover:text-white transition-colors">
                  
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
            )
            }
          </div>
        </div>

        {/* Recent Candidates */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-900">Recent Candidates</h3>
            <button onClick={() => navigateTo('recruitment')} className="text-xs text-primary-600 font-medium hover:text-primary-700 flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {candidates.slice(0, 4).map((candidate) => {
              const stageColors = {
                applied: 'bg-gray-100 text-gray-600',
                screening: 'bg-blue-100 text-blue-700',
                interview: 'bg-violet-100 text-violet-700',
                technical: 'bg-orange-100 text-orange-700',
                hr_round: 'bg-cyan-100 text-cyan-700',
                selected: 'bg-emerald-100 text-emerald-700',
                rejected: 'bg-red-100 text-red-700',
                onboarding: 'bg-green-100 text-green-700'
              };
              return (
                <div key={candidate.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/80 hover:bg-gray-100/80 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {candidate.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{candidate.name}</p>
                    <p className="text-xs text-gray-500">{candidate.position}</p>
                  </div>
                  <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${stageColors[candidate.stage]}`}>
                    {candidate.stage.replace('_', ' ').toUpperCase()}
                  </span>
                </div>);

            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
          { label: 'Add Employee', icon: UserPlus, color: 'bg-blue-50 text-blue-600', page: 'employees' },
          { label: 'Mark Attendance', icon: Clock, color: 'bg-green-50 text-green-600', page: 'attendance' },
          { label: 'Apply Leave', icon: Calendar, color: 'bg-orange-50 text-orange-600', page: 'leaves' },
          { label: 'Run Payroll', icon: DollarSign, color: 'bg-violet-50 text-violet-600', page: 'payroll' },
          { label: 'Post Job', icon: Briefcase, color: 'bg-pink-50 text-pink-600', page: 'recruitment' },
          { label: 'View Reports', icon: TrendingUp, color: 'bg-cyan-50 text-cyan-600', page: 'reports' }].
          map((action) =>
          <button
            key={action.label}
            onClick={() => navigateTo(action.page)}
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:border-primary-200 hover:shadow-md hover:shadow-primary-100/50 transition-all group">
            
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${action.color} group-hover:scale-110 transition-transform`}>
                <action.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-gray-700">{action.label}</span>
            </button>
          )}
        </div>
      </div>
    </div>);

}