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
  const { leaveRequests, leaveBalances, currentUser } = state;

  const [activeTab, setActiveTab] = useState('requests');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [formData, setFormData] = useState({
    type: 'casual',
    startDate: '',
    endDate: '',
    reason: ''
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
      employeeId: currentUser?.id || '',
      employeeName: currentUser?.name || '',
      type: formData.type,
      startDate: formData.startDate,
      endDate: formData.endDate,
      days,
      reason: formData.reason,
      status: 'pending',
      appliedOn: new Date().toISOString().split('T')[0],
      department: currentUser?.department || ''
    };

    dispatch({ type: 'ADD_LEAVE_REQUEST', payload: newRequest });
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
    setFormData({ type: 'casual', startDate: '', endDate: '', reason: '' });
    setErrors({});
  };

  const statusConfig = {
    pending: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    approved: { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    rejected: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' }
  };

  const typeColors = {
    casual: 'bg-blue-100 text-blue-700',
    sick: 'bg-red-100 text-red-700',
    earned: 'bg-green-100 text-green-700',
    paid: 'bg-violet-100 text-violet-700',
    unpaid: 'bg-gray-100 text-gray-700',
    wfh: 'bg-cyan-100 text-cyan-700',
    compensatory: 'bg-orange-100 text-orange-700'
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center">
            <Clock className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            <p className="text-sm text-gray-500">Pending Requests</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
            <p className="text-sm text-gray-500">Approved</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center">
            <XCircle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
            <p className="text-sm text-gray-500">Rejected</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-100">
        <div className="flex items-center justify-between px-5 pt-4 border-b border-gray-100">
          <div className="flex items-center gap-1">
            {['requests', 'balances', 'calendar'].map((tab) =>
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-4 py-2.5 text-sm font-medium rounded-t-xl transition-colors border-b-2 -mb-px',
                activeTab === tab ?
                'border-primary-600 text-primary-600 bg-primary-50/50' :
                'border-transparent text-gray-500 hover:text-gray-700'
              )}>
              
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            )}
          </div>
          <Button icon={<Plus className="w-4 h-4" />} onClick={() => setShowApplyModal(true)} size="sm">
            Apply Leave
          </Button>
        </div>

        {/* Requests Tab */}
        {activeTab === 'requests' &&
        <div>
            <div className="px-5 py-3 flex items-center gap-2 border-b border-gray-50">
              <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-gray-50 rounded-xl text-sm border-0 focus:outline-none focus:ring-2 focus:ring-primary-500/30">
              
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="divide-y divide-gray-50">
              {filtered.length === 0 ?
            <div className="p-12 text-center">
                  <CalendarDays className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No leave requests found</p>
                </div> :

            filtered.map((leave) => {
              const config = statusConfig[leave.status];
              const StatusIcon = config.icon;
              return (
                <div key={leave.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/50 transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {leave.employeeName.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-gray-900">{leave.employeeName}</p>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${typeColors[leave.type]}`}>
                            {leave.type.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {new Date(leave.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(leave.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {leave.days} day{leave.days > 1 ? 's' : ''}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{leave.reason}</p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold', config.bg, config.color)}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                        </div>
                        {leave.status === 'pending' &&
                    <div className="flex items-center gap-1">
                            <button
                        onClick={() => handleApprove(leave.id)}
                        className="w-8 h-8 rounded-xl bg-success-50 text-success-600 flex items-center justify-center hover:bg-success-500 hover:text-white transition-colors">
                        
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button
                        onClick={() => handleReject(leave.id)}
                        className="w-8 h-8 rounded-xl bg-danger-50 text-danger-600 flex items-center justify-center hover:bg-danger-500 hover:text-white transition-colors">
                        
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                    }
                      </div>
                    </div>);

            })
            }
            </div>
          </div>
        }

        {/* Balances Tab */}
        {activeTab === 'balances' &&
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {leaveBalances.map((balance) => {
            const usedPercentage = balance.used / balance.total * 100;
            return (
              <div key={balance.type} className="border border-gray-100 rounded-2xl p-4 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-gray-900">{balance.type}</h4>
                    <span className="text-xs text-gray-400">{balance.used}/{balance.total} used</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
                    <div
                    className={cn(
                      'h-2 rounded-full transition-all',
                      usedPercentage > 80 ? 'bg-red-500' : usedPercentage > 50 ? 'bg-amber-500' : 'bg-primary-500'
                    )}
                    style={{ width: `${usedPercentage}%` }} />
                  
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary-600">{balance.remaining}</span>
                    <span className="text-xs text-gray-500">days remaining</span>
                  </div>
                </div>);

          })}
          </div>
        }

        {/* Calendar Tab */}
        {activeTab === 'calendar' &&
        <div className="p-5">
            <div className="bg-gray-50 rounded-2xl p-6 text-center">
              <CalendarDays className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-gray-700">Holiday Calendar 2024</h3>
              <p className="text-xs text-gray-500 mt-1 mb-4">View upcoming holidays and team availability</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-left max-w-2xl mx-auto">
                {[
              { date: 'Jan 1', name: "New Year's Day" },
              { date: 'Jan 15', name: 'Martin Luther King Jr. Day' },
              { date: 'Feb 19', name: "Presidents' Day" },
              { date: 'May 27', name: 'Memorial Day' },
              { date: 'Jul 4', name: 'Independence Day' },
              { date: 'Sep 2', name: 'Labor Day' },
              { date: 'Nov 28', name: 'Thanksgiving Day' },
              { date: 'Dec 25', name: 'Christmas Day' }].
              map((h) =>
              <div key={h.date} className="bg-white rounded-xl p-3 border border-gray-100">
                    <p className="text-xs font-bold text-primary-600">{h.date}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{h.name}</p>
                  </div>
              )}
              </div>
            </div>
          </div>
        }
      </div>

      {/* Apply Leave Modal */}
      <Modal
        isOpen={showApplyModal}
        onClose={handleCloseModal}
        title="Apply for Leave"
        subtitle="Submit a new leave request"
        footer={
        <>
            <Button variant="ghost" onClick={handleCloseModal}>Cancel</Button>
            <Button onClick={handleSubmit}>Submit Request</Button>
          </>
        }>
        
        <div className="space-y-4">
          <FormSelect
            label="Leave Type"
            value={formData.type}
            onChange={(v) => setFormData({ ...formData, type: v })}
            options={[
            { value: 'casual', label: 'Casual Leave' },
            { value: 'sick', label: 'Sick Leave' },
            { value: 'earned', label: 'Earned Leave' },
            { value: 'wfh', label: 'Work From Home' },
            { value: 'compensatory', label: 'Compensatory Leave' }]
            } />
          
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
          {formData.startDate && formData.endDate &&
          <div className="p-3 rounded-xl bg-primary-50 text-primary-700 text-sm">
              <strong>{calculateDays(formData.startDate, formData.endDate)}</strong> day(s) selected
            </div>
          }
          <FormTextarea
            label="Reason"
            value={formData.reason}
            onChange={(v) => setFormData({ ...formData, reason: v })}
            placeholder="Please provide a reason for your leave..."
            required
            error={errors.reason} />
          
        </div>
      </Modal>
    </div>);

}