import { useState, useMemo } from 'react';
import {
  Clock, UserCheck, UserX, AlertTriangle, Home,
  CalendarDays, Download, LogIn, LogOut } from
'lucide-react';
import { useApp } from '../context/AppContext';
import StatCard from '../components/StatCard';
import { cn } from '../utils/cn';
import { Button } from '../components/FormInput';

export default function Attendance() {
  const { state, dispatch, showToast } = useApp();
  const { attendance = [], todayCheckIn = null, todayCheckOut = null, currentUser = null } = state;

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterStatus, setFilterStatus] = useState('all');

  const todayRecords = useMemo(() => {
    return attendance.filter((a) => a.date === selectedDate);
  }, [attendance, selectedDate]);

  const filtered = useMemo(() => {
    return todayRecords.filter((a) => filterStatus === 'all' || a.status === filterStatus);
  }, [todayRecords, filterStatus]);

  const stats = useMemo(() => ({
    present: todayRecords.filter((a) => a.status === 'present').length,
    absent: todayRecords.filter((a) => a.status === 'absent').length,
    late: todayRecords.filter((a) => a.status === 'late').length,
    wfh: todayRecords.filter((a) => a.status === 'wfh').length,
    onLeave: todayRecords.filter((a) => a.status === 'leave').length
  }), [todayRecords]);

  const handleCheckIn = () => {
    dispatch({ type: 'CHECK_IN' });
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: Date.now().toString(),
        title: 'Checked In',
        message: `You checked in at ${new Date().toLocaleTimeString()}`,
        type: 'success',
        read: false,
        timestamp: new Date().toISOString()
      }
    });
    showToast('success', 'Checked In', `Welcome, ${currentUser?.name}!`);
  };

  const handleCheckOut = () => {
    dispatch({ type: 'CHECK_OUT' });
    showToast('success', 'Checked Out', 'Have a great rest of your day!');
  };

  const exportAttendance = () => {
    const headers = ['Employee', 'Department', 'Check In', 'Check Out', 'Hours', 'Status'];
    const rows = filtered.map((a) => [a.employeeName, a.department, a.checkIn, a.checkOut, a.totalHours, a.status]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-${selectedDate}.csv`;
    a.click();
    showToast('success', 'Export Complete', `Exported ${filtered.length} records.`);
  };

  const statusConfig = {
    present: { label: 'Present', color: 'text-emerald-400', bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500/20' },
    absent: { label: 'Absent', color: 'text-red-400', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/20' },
    half_day: { label: 'Half Day', color: 'text-amber-400', bgColor: 'bg-amber-500/10', borderColor: 'border-amber-500/20' },
    wfh: { label: 'WFH', color: 'text-blue-400', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/20' },
    leave: { label: 'On Leave', color: 'text-violet-400', bgColor: 'bg-violet-500/10', borderColor: 'border-violet-500/20' },
    late: { label: 'Late', color: 'text-orange-400', bgColor: 'bg-orange-500/10', borderColor: 'border-orange-500/20' },
    holiday: { label: 'Holiday', color: 'text-cyan-400', bgColor: 'bg-cyan-500/10', borderColor: 'border-cyan-500/20' }
  };

  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Attendance</h1>
          <p className="text-sm text-zinc-500 mt-1">
            {new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        
        <div className="flex items-center gap-6 bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
          <div className="text-center px-6 border-r border-zinc-800">
            <p className="text-2xl font-bold text-white">
              {todayRecords.length > 0 ? Math.round((stats.present + stats.wfh) / todayRecords.length * 100) : 0}%
            </p>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mt-1">Present Rate</p>
          </div>
          
          {isToday && (
            <div className="flex gap-3">
              {!todayCheckIn ? (
                <Button 
                  onClick={handleCheckIn}
                  className="h-11 px-6 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 border-0" 
                  icon={<LogIn className="w-4 h-4" />}>
                  Check In
                </Button>
              ) : !todayCheckOut ? (
                <Button 
                  onClick={handleCheckOut}
                  className="h-11 px-6 rounded-xl text-xs font-bold bg-zinc-800 border-zinc-700 hover:bg-zinc-700" 
                  icon={<LogOut className="w-4 h-4" />}>
                  Check Out
                </Button>
              ) : (
                <div className="h-11 px-6 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <Clock className="w-4 h-4" /> Checked Out ✓
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
        {[
          { label: 'Present', value: stats.present, icon: UserCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Absent', value: stats.absent, icon: UserX, color: 'text-rose-400', bg: 'bg-rose-500/10' },
          { label: 'Late', value: stats.late, icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'WFH', value: stats.wfh, icon: Home, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'On Leave', value: stats.onLeave, icon: CalendarDays, color: 'text-violet-400', bg: 'bg-violet-500/10' }
        ].map((stat) => (
          <div key={stat.label} className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-4`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
        <div className="flex items-center gap-4 flex-wrap">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2.5 bg-zinc-950 rounded-xl text-xs font-bold border border-zinc-800 text-white focus:outline-none focus:ring-1 focus:ring-primary-500" />
          
          <div className="flex gap-2">
            {['all', 'present', 'absent', 'late', 'wfh'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={cn(
                  "px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all",
                  filterStatus === status 
                    ? "bg-primary-600 border-primary-500 text-white" 
                    : "bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700"
                )}>
                {status}
              </button>
            ))}
          </div>
        </div>
        <Button 
          className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 h-10 px-6 rounded-xl text-xs font-bold" 
          icon={<Download className="w-4 h-4" />} 
          onClick={exportAttendance}>
          Export CSV
        </Button>
      </div>

      {/* Records Table */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-zinc-950 border-b border-zinc-800">
                <th className="text-left px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Employee</th>
                <th className="text-left px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-wider hidden sm:table-cell">Department</th>
                <th className="text-left px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Check In</th>
                <th className="text-left px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Check Out</th>
                <th className="text-left px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-wider hidden md:table-cell">Hours</th>
                <th className="text-left px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filtered.map((record) => {
                const config = statusConfig[record.status] || statusConfig.present;
                return (
                  <tr key={record.id} className="hover:bg-zinc-800/30 transition-all group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 text-[10px] font-bold">
                          {record.employeeName.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <span className="text-sm font-bold text-white group-hover:text-primary-400 transition-colors">{record.employeeName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-zinc-500 hidden sm:table-cell">{record.department}</td>
                    <td className="px-6 py-4">
                      <span className={cn('text-xs font-bold', record.checkIn === '-' ? 'text-zinc-700' : 'text-zinc-300')}>
                        {record.checkIn}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn('text-xs font-bold', record.checkOut === '-' ? 'text-zinc-700' : 'text-zinc-300')}>
                        {record.checkOut}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-zinc-500 hidden md:table-cell">
                      {record.totalHours > 0 ? `${record.totalHours}h` : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "text-[9px] font-bold px-2 py-1 rounded border uppercase tracking-wider",
                        config.bgColor, config.color, config.borderColor
                      )}>
                        {config.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-20 text-center">
            <Clock className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">No records found for this date</p>
          </div>
        )}
      </div>
    </div>
  );
}


