import { useState, useMemo } from 'react';
import {
  Plus, MessageSquare, Clock, CheckCircle2,
  Search } from
'lucide-react';
import { useApp } from '../context/AppContext';
import StatCard from '../components/StatCard';
import Modal from '../components/Modal';
import { FormInput, FormSelect, FormTextarea, Button } from '../components/FormInput';
import { cn } from '../utils/cn';


export default function HelpDesk() {
  const { state, dispatch, showToast } = useApp();
  const { tickets = [], currentUser = null } = state;

  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'IT',
    priority: 'medium'
  });

  const stats = useMemo(() => ({
    open: tickets.filter((t) => t.status === 'open').length,
    inProgress: tickets.filter((t) => t.status === 'in_progress').length,
    resolved: tickets.filter((t) => t.status === 'resolved').length
  }), [tickets]);

  const filtered = useMemo(() => {
    return tickets.filter((t) => {
      const matchStatus = filterStatus === 'all' || t.status === filterStatus;
      const matchPriority = filterPriority === 'all' || t.priority === filterPriority;
      const matchSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchPriority && matchSearch;
    });
  }, [tickets, filterStatus, filterPriority, searchQuery]);

  const handleCreateTicket = () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      showToast('error', 'Validation Error', 'Please provide a title and description.');
      return;
    }

    const newTicket = {
      id: `t${Date.now()}`,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      priority: formData.priority,
      status: 'open',
      createdBy: currentUser?.name || '',
      createdDate: new Date().toISOString().split('T')[0],
      assignedTo: 'Support Team'
    };

    dispatch({ type: 'ADD_TICKET', payload: newTicket });
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: Date.now().toString(),
        title: 'Ticket Created',
        message: `Your ticket "${formData.title}" has been submitted.`,
        type: 'info',
        read: false,
        timestamp: new Date().toISOString()
      }
    });
    showToast('success', 'Ticket Created', 'Your support request has been logged.');
    handleCloseModal();
  };

  const handleResolve = (id) => {
    dispatch({ type: 'RESOLVE_TICKET', payload: id });
    showToast('success', 'Ticket Resolved', 'The ticket has been marked as resolved.');
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setFormData({ title: '', description: '', category: 'IT', priority: 'medium' });
  };

  const priorityConfig = {
    low: { color: 'text-zinc-500', bg: 'bg-zinc-800 border-zinc-700', label: 'Low' },
    medium: { color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', label: 'Medium' },
    high: { color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20', label: 'High' },
    urgent: { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', label: 'Urgent' }
  };

  const statusConfig = {
    open: { color: 'text-blue-400', bg: 'bg-blue-500/10', icon: MessageSquare, label: 'Open' },
    in_progress: { color: 'text-amber-400', bg: 'bg-amber-500/10', icon: Clock, label: 'In Progress' },
    resolved: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: CheckCircle2, label: 'Resolved' },
    closed: { color: 'text-zinc-500', bg: 'bg-zinc-800', icon: CheckCircle2, label: 'Closed' }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Help Desk</h1>
          <p className="text-sm text-zinc-500 mt-1">Submit and track support requests.</p>
        </div>
        <Button 
          className="bg-primary-600 hover:bg-primary-500 text-xs font-bold px-6 h-11 shadow-lg shadow-primary-900/20"
          onClick={() => setShowCreateModal(true)}
          icon={<Plus className="w-4 h-4" />}>
          New Ticket
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: 'Open Tickets', value: stats.open, icon: MessageSquare, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
          { label: 'In Progress', value: stats.inProgress, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
          { label: 'Resolved', value: stats.resolved, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' }
        ].map((stat) => (
          <div key={stat.label} className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 flex flex-col">
            <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.border} border flex items-center justify-center mb-4`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold text-white tracking-tight">{stat.value}</p>
            <p className="text-xs font-medium text-zinc-500 mt-1 uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-4 flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-primary-500 transition-colors" />
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-zinc-950 rounded-xl text-sm border border-zinc-800 focus:border-primary-500/50 outline-none transition-all placeholder:text-zinc-600" />
        </div>
        <div className="flex gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 bg-zinc-950 rounded-xl text-xs font-bold border border-zinc-800 outline-none uppercase text-zinc-400 focus:border-primary-500/50 min-w-[140px]">
            <option value="all">Status: All</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2.5 bg-zinc-950 rounded-xl text-xs font-bold border border-zinc-800 outline-none uppercase text-zinc-400 focus:border-primary-500/50 min-w-[140px]">
            <option value="all">Priority: All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-20 text-center">
            <MessageSquare className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
            <p className="text-sm font-medium text-zinc-500">No support tickets found.</p>
          </div>
        ) : (
          filtered.map((ticket) => {
            const pConfig = priorityConfig[ticket.priority];
            const sConfig = statusConfig[ticket.status];
            const StatusIcon = sConfig.icon;
            return (
              <div key={ticket.id} className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 hover:border-zinc-700 transition-all group">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0', sConfig.bg)}>
                    <StatusIcon className={cn('w-6 h-6', sConfig.color)} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <h4 className="text-base font-bold text-white group-hover:text-primary-400 transition-colors">{ticket.title}</h4>
                          <span className={cn('text-[9px] font-bold px-2 py-1 rounded border uppercase tracking-wider', pConfig.bg, pConfig.color)}>
                            {pConfig.label}
                          </span>
                        </div>
                        <p className="text-sm text-zinc-500 mt-1 line-clamp-1">{ticket.description}</p>
                      </div>
                      
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className={cn('text-[10px] font-bold px-2.5 py-1 rounded-md border uppercase tracking-wider', sConfig.bg, sConfig.color, 'border-' + sConfig.color.split('-')[1] + '-500/20')}>
                          {sConfig.label}
                        </span>
                        {(ticket.status !== 'resolved' && ticket.status !== 'closed') && (
                          <Button 
                            className="h-8 px-4 bg-emerald-600 hover:bg-emerald-500 text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-emerald-900/20"
                            onClick={() => handleResolve(ticket.id)}>
                            Resolve
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 mt-5 pt-4 border-t border-zinc-800">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-wider">Created By</span>
                        <span className="text-xs text-white font-medium">{ticket.createdBy}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-wider">Category</span>
                        <span className="text-xs text-white font-medium">{ticket.category}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-wider">Assigned To</span>
                        <span className="text-xs text-white font-medium">{ticket.assignedTo}</span>
                      </div>
                      <div className="flex flex-col ml-auto">
                        <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-wider text-right">Date</span>
                        <span className="text-xs text-white font-medium text-right">
                          {new Date(ticket.createdDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create Ticket Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={handleCloseModal}
        title="Create New Ticket"
        subtitle="Submit a support request to the team."
        size="lg"
        footer={
          <div className="flex gap-3 w-full">
            <Button className="flex-1 bg-zinc-800 text-xs font-bold h-12" variant="ghost" onClick={handleCloseModal}>Cancel</Button>
            <Button className="flex-1 bg-primary-600 text-xs font-bold h-12 shadow-lg shadow-primary-900/20" onClick={handleCreateTicket}>Submit Ticket</Button>
          </div>
        }>
        
        <div className="space-y-6">
          <FormInput
            label="Ticket Title"
            value={formData.title}
            onChange={(v) => setFormData({ ...formData, title: v })}
            placeholder="e.g. System Access Issue"
            required />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormSelect
              label="Category"
              value={formData.category}
              onChange={(v) => setFormData({ ...formData, category: v })}
              options={[
                { value: 'Payroll', label: 'Payroll' },
                { value: 'Leave', label: 'Leave & Attendance' },
                { value: 'Assets', label: 'IT Assets' },
                { value: 'IT', label: 'IT Support' },
                { value: 'Policy', label: 'HR Policy' },
                { value: 'Other', label: 'Other' }
              ]} />
            
            <FormSelect
              label="Priority"
              value={formData.priority}
              onChange={(v) => setFormData({ ...formData, priority: v })}
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
                { value: 'urgent', label: 'Urgent' }
              ]} />
          </div>

          <FormTextarea
            label="Description"
            value={formData.description}
            onChange={(v) => setFormData({ ...formData, description: v })}
            placeholder="Please provide details about your request..."
            required />
        </div>
      </Modal>
    </div>
  );
}

