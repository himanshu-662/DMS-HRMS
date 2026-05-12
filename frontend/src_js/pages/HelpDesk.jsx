import { useState, useMemo } from 'react';
import { Plus, MessageSquare, Clock, CheckCircle2, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import StatCard from '../components/StatCard';
import Modal from '../components/Modal';
import { FormInput, FormSelect, FormTextarea, Button } from '../components/FormInput';
import { cn } from '../utils/cn';
export default function HelpDesk() {
    const { state, dispatch, showToast } = useApp();
    const { tickets, currentUser } = state;
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterPriority, setFilterPriority] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'IT',
        priority: 'medium',
    });
    const stats = useMemo(() => ({
        open: tickets.filter(t => t.status === 'open').length,
        inProgress: tickets.filter(t => t.status === 'in_progress').length,
        resolved: tickets.filter(t => t.status === 'resolved').length,
    }), [tickets]);
    const filtered = useMemo(() => {
        return tickets.filter(t => {
            const matchStatus = filterStatus === 'all' || t.status === filterStatus;
            const matchPriority = filterPriority === 'all' || t.priority === filterPriority;
            const matchSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchStatus && matchPriority && matchSearch;
        });
    }, [tickets, filterStatus, filterPriority, searchQuery]);
    const handleCreateTicket = () => {
        if (!formData.title.trim() || !formData.description.trim()) {
            showToast('error', 'Validation Error', 'Please fill in all required fields.');
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
            assignedTo: 'HR Team',
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
                timestamp: new Date().toISOString(),
            },
        });
        showToast('success', 'Ticket Created', 'Your support ticket has been submitted.');
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
        low: { color: 'text-gray-600', bg: 'bg-gray-100' },
        medium: { color: 'text-blue-700', bg: 'bg-blue-100' },
        high: { color: 'text-orange-700', bg: 'bg-orange-100' },
        urgent: { color: 'text-red-700', bg: 'bg-red-100' },
    };
    const statusConfig = {
        open: { color: 'text-blue-700', bg: 'bg-blue-50', icon: MessageSquare },
        in_progress: { color: 'text-amber-700', bg: 'bg-amber-50', icon: Clock },
        resolved: { color: 'text-emerald-700', bg: 'bg-emerald-50', icon: CheckCircle2 },
        closed: { color: 'text-gray-600', bg: 'bg-gray-50', icon: CheckCircle2 },
    };
    return (<div className="space-y-5 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Open Tickets" value={stats.open} icon={MessageSquare} color="blue"/>
        <StatCard title="In Progress" value={stats.inProgress} icon={Clock} color="orange"/>
        <StatCard title="Resolved" value={stats.resolved} icon={CheckCircle2} color="green"/>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
          <input type="text" placeholder="Search tickets..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl text-sm border-0 focus:outline-none focus:ring-2 focus:ring-primary-500/30"/>
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2.5 bg-gray-50 rounded-xl text-sm border-0 focus:outline-none focus:ring-2 focus:ring-primary-500/30">
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
        <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="px-3 py-2.5 bg-gray-50 rounded-xl text-sm border-0 focus:outline-none focus:ring-2 focus:ring-primary-500/30">
          <option value="all">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
        <Button icon={<Plus className="w-4 h-4"/>} onClick={() => setShowCreateModal(true)}>
          New Ticket
        </Button>
      </div>

      {/* Tickets List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (<div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3"/>
            <p className="text-sm text-gray-500">No tickets found</p>
          </div>) : (filtered.map(ticket => {
            const pConfig = priorityConfig[ticket.priority];
            const sConfig = statusConfig[ticket.status];
            const StatusIcon = sConfig.icon;
            return (<div key={ticket.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:shadow-gray-100/50 transition-all">
                <div className="flex items-start gap-4">
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', sConfig.bg)}>
                    <StatusIcon className={cn('w-5 h-5', sConfig.color)}/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-semibold text-gray-900">{ticket.title}</h4>
                          <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full uppercase', pConfig.bg, pConfig.color)}>
                            {ticket.priority}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{ticket.description}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={cn('text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap', sConfig.bg, sConfig.color)}>
                          {ticket.status.replace('_', ' ').toUpperCase()}
                        </span>
                        {ticket.status !== 'resolved' && ticket.status !== 'closed' && (<Button size="sm" variant="secondary" onClick={() => handleResolve(ticket.id)}>
                            Resolve
                          </Button>)}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                      <span>By: <span className="text-gray-600 font-medium">{ticket.createdBy}</span></span>
                      <span>Category: <span className="text-gray-600 font-medium">{ticket.category}</span></span>
                      <span>Assigned: <span className="text-gray-600 font-medium">{ticket.assignedTo}</span></span>
                      <span className="hidden sm:inline">
                        {new Date(ticket.createdDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>);
        }))}
      </div>

      {/* Create Ticket Modal */}
      <Modal isOpen={showCreateModal} onClose={handleCloseModal} title="Create New Ticket" subtitle="Submit your HR query or request" footer={<>
            <Button variant="ghost" onClick={handleCloseModal}>Cancel</Button>
            <Button onClick={handleCreateTicket}>Submit Ticket</Button>
          </>}>
        <div className="space-y-4">
          <FormInput label="Title" value={formData.title} onChange={(v) => setFormData({ ...formData, title: v })} placeholder="Brief description of your issue" required/>
          <div className="grid grid-cols-2 gap-4">
            <FormSelect label="Category" value={formData.category} onChange={(v) => setFormData({ ...formData, category: v })} options={[
            { value: 'Payroll', label: 'Payroll' },
            { value: 'Leave', label: 'Leave' },
            { value: 'Assets', label: 'Assets' },
            { value: 'IT', label: 'IT' },
            { value: 'Policy', label: 'Policy' },
            { value: 'Other', label: 'Other' },
        ]}/>
            <FormSelect label="Priority" value={formData.priority} onChange={(v) => setFormData({ ...formData, priority: v })} options={[
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' },
            { value: 'urgent', label: 'Urgent' },
        ]}/>
          </div>
          <FormTextarea label="Description" value={formData.description} onChange={(v) => setFormData({ ...formData, description: v })} placeholder="Provide detailed description..." required/>
        </div>
      </Modal>
    </div>);
}
