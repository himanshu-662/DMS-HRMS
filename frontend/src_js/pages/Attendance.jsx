import { useState, useMemo } from 'react';
import { Clock, UserCheck, UserX, AlertTriangle, Home, CalendarDays, Download, LogIn, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';
import StatCard from '../components/StatCard';
import { cn } from '../utils/cn';
import { Button } from '../components/FormInput';
export default function Attendance() {
    const { state, dispatch, showToast } = useApp();
    const { attendance, todayCheckIn, todayCheckOut, currentUser } = state;
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [filterStatus, setFilterStatus] = useState('all');
    const todayRecords = useMemo(() => {
        return attendance.filter(a => a.date === selectedDate);
    }, [attendance, selectedDate]);
    const filtered = useMemo(() => {
        return todayRecords.filter(a => filterStatus === 'all' || a.status === filterStatus);
    }, [todayRecords, filterStatus]);
    const stats = useMemo(() => ({
        present: todayRecords.filter(a => a.status === 'present').length,
        absent: todayRecords.filter(a => a.status === 'absent').length,
        late: todayRecords.filter(a => a.status === 'late').length,
        wfh: todayRecords.filter(a => a.status === 'wfh').length,
        onLeave: todayRecords.filter(a => a.status === 'leave').length,
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
                timestamp: new Date().toISOString(),
            },
        });
        showToast('success', 'Checked In', `Welcome, ${currentUser?.name}!`);
    };
    const handleCheckOut = () => {
        dispatch({ type: 'CHECK_OUT' });
        showToast('success', 'Checked Out', 'Have a great rest of your day!');
    };
    const exportAttendance = () => {
        const headers = ['Employee', 'Department', 'Check In', 'Check Out', 'Hours', 'Status'];
        const rows = filtered.map(a => [a.employeeName, a.department, a.checkIn, a.checkOut, a.totalHours, a.status]);
        const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `attendance-${selectedDate}.csv`;
        a.click();
        showToast('success', 'Export Complete', `Exported ${filtered.length} records.`);
    };
    const statusConfig = {
        present: { label: 'Present', color: 'text-emerald-700', bgColor: 'bg-emerald-100' },
        absent: { label: 'Absent', color: 'text-red-700', bgColor: 'bg-red-100' },
        half_day: { label: 'Half Day', color: 'text-amber-700', bgColor: 'bg-amber-100' },
        wfh: { label: 'WFH', color: 'text-blue-700', bgColor: 'bg-blue-100' },
        leave: { label: 'On Leave', color: 'text-violet-700', bgColor: 'bg-violet-100' },
        late: { label: 'Late', color: 'text-orange-700', bgColor: 'bg-orange-100' },
        holiday: { label: 'Holiday', color: 'text-cyan-700', bgColor: 'bg-cyan-100' },
    };
    const isToday = selectedDate === new Date().toISOString().split('T')[0];
    return (<div className="space-y-5 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard title="Present" value={stats.present} icon={UserCheck} color="green"/>
        <StatCard title="Absent" value={stats.absent} icon={UserX} color="red"/>
        <StatCard title="Late" value={stats.late} icon={AlertTriangle} color="orange"/>
        <StatCard title="WFH" value={stats.wfh} icon={Home} color="blue"/>
        <StatCard title="On Leave" value={stats.onLeave} icon={CalendarDays} color="purple"/>
      </div>

      {/* Check-In/Out Card */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold">Today's Attendance</h3>
            <p className="text-primary-200 text-sm mt-1">
              {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            {isToday && (<div className="flex items-center gap-4 mt-3">
                {todayCheckIn && (<div className="flex items-center gap-2">
                    <LogIn className="w-4 h-4 text-primary-200"/>
                    <span className="text-sm">In: <strong>{todayCheckIn}</strong></span>
                  </div>)}
                {todayCheckOut && (<div className="flex items-center gap-2">
                    <LogOut className="w-4 h-4 text-primary-200"/>
                    <span className="text-sm">Out: <strong>{todayCheckOut}</strong></span>
                  </div>)}
              </div>)}
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold">
                {todayRecords.length > 0
            ? Math.round((stats.present + stats.wfh) / todayRecords.length * 100)
            : 0}%
              </p>
              <p className="text-xs text-primary-200 mt-1">Attendance Rate</p>
            </div>
            {isToday && (<div className="flex gap-2">
                {!todayCheckIn ? (<button onClick={handleCheckIn} className="flex items-center gap-2 px-5 py-2.5 bg-white text-primary-700 rounded-xl font-semibold text-sm hover:bg-primary-50 transition-colors">
                    <LogIn className="w-4 h-4"/> Check In
                  </button>) : !todayCheckOut ? (<button onClick={handleCheckOut} className="flex items-center gap-2 px-5 py-2.5 bg-white/20 text-white rounded-xl font-semibold text-sm hover:bg-white/30 transition-colors border border-white/30">
                    <LogOut className="w-4 h-4"/> Check Out
                  </button>) : (<div className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-xl text-sm">
                    <Clock className="w-4 h-4"/>
                    Day Complete ✓
                  </div>)}
              </div>)}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="px-3 py-2.5 bg-gray-50 rounded-xl text-sm border-0 focus:outline-none focus:ring-2 focus:ring-primary-500/30"/>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2.5 bg-gray-50 rounded-xl text-sm border-0 focus:outline-none focus:ring-2 focus:ring-primary-500/30">
              <option value="all">All Status</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
              <option value="wfh">WFH</option>
              <option value="leave">On Leave</option>
              <option value="half_day">Half Day</option>
            </select>
          </div>
          <Button variant="secondary" icon={<Download className="w-4 h-4"/>} onClick={exportAttendance}>
            Export
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Employee</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Department</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Check In</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Check Out</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Hours</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(record => {
            const config = statusConfig[record.status];
            return (<tr key={record.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {record.employeeName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{record.employeeName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 hidden sm:table-cell">{record.department}</td>
                    <td className="px-4 py-3">
                      <span className={cn('text-sm font-medium', record.checkIn === '-' ? 'text-gray-400' : 'text-gray-900')}>
                        {record.checkIn}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('text-sm font-medium', record.checkOut === '-' ? 'text-gray-400' : 'text-gray-900')}>
                        {record.checkOut}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">
                      {record.totalHours > 0 ? `${record.totalHours}h` : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${config.bgColor} ${config.color}`}>
                        {config.label}
                      </span>
                    </td>
                  </tr>);
        })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (<div className="p-12 text-center">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3"/>
            <p className="text-sm text-gray-500">No attendance records for this date</p>
          </div>)}
      </div>
    </div>);
}
