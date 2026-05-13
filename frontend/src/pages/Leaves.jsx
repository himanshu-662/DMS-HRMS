import { useState, useMemo } from 'react';
import {
  Plus, CheckCircle2, XCircle, Clock, CalendarDays } from
'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../utils/cn';
import Modal from '../components/Modal';
import { FormInput, FormSelect, FormTextarea, Button } from '../components/FormInput';


export default function Leaves() {
  const { state, dispatch, showToast } = useApp();
  const { leaveRequests = [], leaveBalances = [], currentUser = null } = state;

  const [activeTab, setActiveTab] = useState('requests');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [formData, setFormData] = useState({
    type: 'casual',
    startDate: '',
    endDate: '',
    reason: '',
    employeeName: currentUser?.name || ''
  });
  const [errors, setErrors] = useState({});

  const filtered = useMemo(() => {
    return leaveRequests.filter((l) => filterStatus === 'all' || l.status === filterStatus);
  }, [leaveRequests, filterStatus]);

  const stats = useMemo(() => ({
    pending: leaveRequests.filter((l) => l.status === 'pending').length,
    approved: leaveRequests.filter((l) => l.status === 'approved').length,
    rejected: leaveRequests.filter((l) => l.status === 'rejected').length
  }), [leaveRequests]);

  const calculateDays = (start, end) => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(0, diff);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (formData.startDate && formData.endDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    if (!formData.reason.trim()) newErrors.reason = 'Reason is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const days = calculateDays(formData.startDate, formData.endDate);
    const newRequest = {
      id: `l${Date.now()}`,
      employeeId: state.employees.find(e => e.name === formData.employeeName)?.id || currentUser?.id || '',
      employeeName: formData.employeeName || currentUser?.name || '',
      type: formData.type,
      startDate: formData.startDate,
      endDate: formData.endDate,
      days,
      reason: formData.reason,
      status: 'pending',
      appliedOn: new Date().toISOString().split('T')[0],
      department: state.employees.find(e => e.name === formData.employeeName)?.department || currentUser?.department || ''
    };

    dispatch({ type: 'ADD_LEAVE', payload: newRequest });
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: Date.now().toString(),
        title: 'Leave Applied',
        message: `Your ${formData.type} leave request for ${days} day(s) has been submitted.`,
        type: 'info',
        read: false,
        timestamp: new Date().toISOString()
      }
    });
    showToast('success', 'Leave Applied', `Your request for ${days} day(s) has been submitted.`);
    handleCloseModal();
  };

  const handleApprove = (id) => {
    dispatch({ type: 'APPROVE_LEAVE', payload: id });
    showToast('success', 'Leave Approved', 'The leave request has been approved.');
  };

  const handleReject = (id) => {
    dispatch({ type: 'REJECT_LEAVE', payload: id });
    showToast('info', 'Leave Rejected', 'The leave request has been rejected.');
  };

  const handleCloseModal = () => {
    setShowApplyModal(false);
    setFormData({ type: 'casual', startDate: '', endDate: '', reason: '', employeeName: currentUser?.name || '' });
    setErrors({});
  };

  const statusConfig = {
    pending: { icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    approved: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    rejected: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' }
  };

  const typeColors = {
    casual: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    sick: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    earned: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    paid: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    unpaid: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
    wfh: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    compensatory: 'bg-orange-500/10 text-orange-400 border-orange-500/20'
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Leave Management</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage leave requests and track time-off balances.</p>
        </div>
        <Button 
          className="h-11 px-6 rounded-xl text-xs font-bold bg-primary-600 hover:bg-primary-500 border-0" 
          icon={<Plus className="w-4 h-4" />} 
          onClick={() => setShowApplyModal(true)}>
          Apply for Leave
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: 'Pending Approval', value: stats.pending, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Approved', value: stats.approved, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'text-rose-400', bg: 'bg-rose-500/10' }
        ].map((stat) => (
          <div key={stat.label} className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 flex items-center gap-5">
            <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs and Filters */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="bg-zinc-900 p-1 rounded-xl border border-zinc-800 inline-flex">
            {['requests', 'balances', 'holidays'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all',
                  activeTab === tab ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                )}>
                {tab}
              </button>
            ))}
          </div>
          
          {activeTab === 'requests' && (
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 bg-zinc-900 rounded-xl text-xs font-bold border border-zinc-800 text-white focus:outline-none focus:ring-1 focus:ring-primary-500">
              <option value="all">Status: All</option>
              <option value="pending">Status: Pending</option>
              <option value="approved">Status: Approved</option>
              <option value="rejected">Status: Rejected</option>
            </select>
          )}
        </div>

        {/* Requests List */}
        {activeTab === 'requests' && (
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden shadow-xl">
            <div className="divide-y divide-zinc-800">
              {filtered.length === 0 ? (
                <div className="p-20 text-center">
                  <CalendarDays className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">No leave requests found</p>
                </div>
              ) : (
                filtered.map((leave) => {
                  const config = statusConfig[leave.status] || statusConfig.pending;
                  const StatusIcon = config.icon;
                  return (
                    <div key={leave.id} className="flex flex-col md:flex-row md:items-center gap-6 px-6 py-6 hover:bg-zinc-800/30 transition-all group">
                      <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 text-sm font-bold flex-shrink-0">
                        {leave.employeeName.split(' ').map((n) => n[0]).join('')}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <p className="text-sm font-bold text-white group-hover:text-primary-400 transition-colors">{leave.employeeName}</p>
                          <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider", typeColors[leave.type] || typeColors.casual)}>
                            {leave.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-1.5">
                          <p className="text-[10px] font-bold text-zinc-500 uppercase">
                            {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                          </p>
                          <span className="w-1 h-1 rounded-full bg-zinc-800" />
                          <p className="text-[10px] font-bold text-primary-400 uppercase tracking-wider">{leave.days} Days</p>
                        </div>
                        <p className="text-xs text-zinc-500 mt-2 max-w-2xl">{leave.reason}</p>
                      </div>

                      <div className="flex items-center gap-4 flex-shrink-0">
                        <div className={cn('flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border', config.bg, config.color, config.border)}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {leave.status}
                        </div>
                        
                        {leave.status === 'pending' && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleApprove(leave.id)}
                              className="w-9 h-9 rounded-lg bg-zinc-950 border border-zinc-800 text-emerald-500 flex items-center justify-center hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all">
                              <CheckCircle2 className="w-4.5 h-4.5" />
                            </button>
                            <button
                              onClick={() => handleReject(leave.id)}
                              className="w-9 h-9 rounded-lg bg-zinc-950 border border-zinc-800 text-rose-500 flex items-center justify-center hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all">
                              <XCircle className="w-4.5 h-4.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Balances List */}
        {activeTab === 'balances' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {leaveBalances.map((balance, idx) => {
              const types = [
                { key: 'annual', label: 'Annual leave', total: 20, color: 'bg-primary-500' },
                { key: 'sick', label: 'Sick leave', total: 12, color: 'bg-rose-500' },
                { key: 'casual', label: 'Casual leave', total: 8, color: 'bg-amber-500' },
              ];
              const empName = leaveRequests.find((l) => l.employeeId === balance.employeeId)?.employeeName
                || `Employee ${idx + 1}`;
              return (
                <div key={balance.employeeId} className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 hover:border-zinc-700 transition-all space-y-5">
                  <p className="text-sm font-bold text-white">{empName}</p>
                  {types.map((t) => {
                    const remaining = balance[t.key] ?? 0;
                    const used = t.total - remaining;
                    const pct = Math.min((used / t.total) * 100, 100);
                    return (
                      <div key={t.key}>
                        <div className="flex justify-between mb-1.5">
                          <span className="text-xs text-zinc-400">{t.label}</span>
                          <span className="text-xs font-bold text-white">{remaining} <span className="text-zinc-600 font-normal">/ {t.total} days</span></span>
                        </div>
                        <div className="w-full bg-zinc-950 rounded-full h-1.5 overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-700 ${t.color}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}

        {/* Holiday Calendar */}
        {activeTab === 'holidays' && (
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary-600/10 border border-primary-500/20 flex items-center justify-center mx-auto mb-6">
              <CalendarDays className="w-8 h-8 text-primary-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Public Holidays 2024</h3>
            <p className="text-xs text-zinc-500 mt-2 mb-10">Company-wide holidays and observances.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
              {[
                { date: 'Jan 01', name: "New Year's Day" },
                { date: 'Jan 15', name: 'MLK Day' },
                { date: 'Feb 19', name: "Presidents' Day" },
                { date: 'May 27', name: 'Memorial Day' },
                { date: 'Jul 04', name: 'Independence Day' },
                { date: 'Sep 02', name: 'Labor Day' },
                { date: 'Nov 28', name: 'Thanksgiving Day' },
                { date: 'Dec 25', name: 'Christmas Day' }
              ].map((h) => (
                <div key={h.date} className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                  <p className="text-xs font-bold text-primary-400">{h.date}</p>
                  <p className="text-[11px] font-bold text-zinc-400 mt-1 uppercase tracking-tight">{h.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Apply Leave Modal */}
      <Modal
        isOpen={showApplyModal}
        onClose={handleCloseModal}
        title="Apply for Leave"
        subtitle="Submit a new leave request for approval."
        size="lg"
        footer={
          <div className="flex gap-3">
            <Button className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 h-11 px-6 rounded-xl text-xs font-bold" onClick={handleCloseModal}>Cancel</Button>
            <Button className="bg-primary-600 hover:bg-primary-500 h-11 px-8 rounded-xl text-xs font-bold border-0" onClick={handleSubmit}>Submit Request</Button>
          </div>
        }>
        
        <div className="space-y-6">
          {currentUser?.role === 'admin' && (
            <FormSelect
              label="On Behalf Of"
              value={formData.employeeName}
              onChange={(v) => setFormData({ ...formData, employeeName: v })}
              options={[
                { value: '', label: 'Select Employee...' },
                ...state.employees.map(e => ({ value: e.name, label: e.name.toUpperCase() }))
              ]}
              required
            />
          )}
          <FormSelect
            label="Leave Type"
            value={formData.type}
            onChange={(v) => setFormData({ ...formData, type: v })}
            options={[
              { value: 'casual', label: 'Casual Leave' },
              { value: 'sick', label: 'Sick Leave' },
              { value: 'earned', label: 'Earned Leave' },
              { value: 'wfh', label: 'Work From Home' },
              { value: 'compensatory', label: 'Compensatory Off' }
            ]} />
          
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(v) => setFormData({ ...formData, startDate: v })}
              required
              error={errors.startDate}
              min={new Date().toISOString().split('T')[0]} />
            
            <FormInput
              label="End Date"
              type="date"
              value={formData.endDate}
              onChange={(v) => setFormData({ ...formData, endDate: v })}
              required
              error={errors.endDate}
              min={formData.startDate || new Date().toISOString().split('T')[0]} />
          </div>
          
          {formData.startDate && formData.endDate && (
            <div className="p-4 rounded-xl bg-primary-500/5 border border-primary-500/10 flex items-center justify-between">
              <span className="text-[10px] font-bold text-zinc-500 uppercase">Calculated Duration</span>
              <span className="text-lg font-bold text-primary-400">{calculateDays(formData.startDate, formData.endDate)} Days</span>
            </div>
          )}
          
          <FormTextarea
            label="Reason for Leave"
            value={formData.reason}
            onChange={(v) => setFormData({ ...formData, reason: v })}
            placeholder="Enter your reason here..."
            required
            error={errors.reason} />
        </div>
      </Modal>
    </div>
  );
}


