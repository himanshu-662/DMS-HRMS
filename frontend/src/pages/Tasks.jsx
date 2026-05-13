import { useState, useMemo } from 'react';
import { 
  Plus, CheckCircle2, Clock, AlertCircle, 
  Trash2, MoreHorizontal, Calendar, User,
  CheckCircle, Circle, Filter, Search
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../utils/cn';
import Modal from '../components/Modal';
import { FormInput, FormSelect, FormTextarea, Button } from '../components/FormInput';
import StatCard from '../components/StatCard';

export default function Tasks() {
  const { state, dispatch, showToast } = useApp();
  const { tasks = [], employees = [] } = state;

  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    assignee: '',
    dueDate: '',
    status: 'todo',
    category: 'general'
  });

  const stats = useMemo(() => ({
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  }), [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      const matchTab = activeTab === 'all' || t.status === activeTab;
      const matchSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         t.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchTab && matchSearch;
    });
  }, [tasks, activeTab, searchQuery]);

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('error', 'error', 'Please enter a task title');
      return;
    }

    const newTask = {
      ...formData,
      id: `tk${Date.now()}`,
      status: 'todo'
    };

    dispatch({ type: 'ADD_TASK', payload: newTask });
    showToast('success', 'success', 'Task created successfully');
    setShowCreateModal(false);
    setFormData({ title: '', description: '', priority: 'medium', assignee: '', dueDate: '', status: 'todo', category: 'general' });
  };

  const priorityColors = {
    low: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    high: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  };

  const statusIcons = {
    todo: <Circle className="w-5 h-5 text-zinc-600" />,
    in_progress: <Clock className="w-5 h-5 text-amber-500" />,
    completed: <CheckCircle className="w-5 h-5 text-emerald-500" />,
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Task Manager</h1>
          <p className="text-sm text-zinc-500 mt-1">Assign, track, and manage team tasks efficiently.</p>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)}
          icon={<Plus className="w-4 h-4" />}
          className="h-11 px-6 rounded-xl text-xs font-bold bg-primary-600 hover:bg-primary-500 border-0">
          Create new task
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total tasks" value={stats.total} icon={AlertCircle} color="indigo" />
        <StatCard title="To do" value={stats.todo} icon={Circle} color="zinc" />
        <StatCard title="In progress" value={stats.inProgress} icon={Clock} color="orange" />
        <StatCard title="Completed" value={stats.completed} icon={CheckCircle2} color="emerald" />
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 p-1 bg-zinc-900 border border-zinc-800 rounded-2xl w-fit">
          {['all', 'todo', 'in_progress', 'completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-6 py-2 rounded-xl text-xs font-bold transition-all capitalize",
                activeTab === tab ? "bg-zinc-800 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"
              )}>
              {tab.replace('_', ' ')}
            </button>
          ))}
        </div>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-primary-500 transition-colors" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 pr-5 py-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-sm text-white focus:outline-none focus:border-primary-500 transition-all w-full md:w-80"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredTasks.length === 0 ? (
          <div className="py-24 text-center bg-zinc-900 rounded-[2.5rem] border border-zinc-800">
            <h3 className="text-lg font-bold text-white">No tasks found</h3>
            <p className="text-sm text-zinc-500 mt-1">Try adjusting your filters or create a new task.</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div 
              key={task.id}
              className="group p-6 bg-zinc-900 rounded-[2rem] border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col md:flex-row md:items-center gap-6">
              
              <div className="relative group/status">
                <select
                  value={task.status}
                  onChange={(e) => dispatch({ type: 'UPDATE_TASK', payload: { id: task.id, status: e.target.value } })}
                  className={cn(
                    "appearance-none bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-[10px] font-bold uppercase cursor-pointer outline-none transition-all hover:border-zinc-700",
                    task.status === 'completed' ? "text-emerald-500 border-emerald-500/20 bg-emerald-500/5" :
                    task.status === 'in_progress' ? "text-amber-500 border-amber-500/20 bg-amber-500/5" :
                    "text-zinc-500"
                  )}>
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none">
                  {statusIcons[task.status]}
                </div>
                <style>{`
                  select { padding-left: 32px !important; }
                  select option { background: #09090b; color: #fff; }
                `}</style>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className={cn(
                    "text-base font-bold truncate",
                    task.status === 'completed' ? "text-zinc-500 line-through" : "text-white"
                  )}>{task.title}</h4>
                  <span className={cn("px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase border", priorityColors[task.priority])}>
                    {task.priority}
                  </span>
                </div>
                <p className="text-sm text-zinc-500 line-clamp-1">{task.description}</p>
              </div>

              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-950 rounded-xl border border-zinc-800">
                  <User className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="text-xs font-medium text-zinc-400">{task.assignee || 'Unassigned'}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-950 rounded-xl border border-zinc-800">
                  <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="text-xs font-medium text-zinc-400">{task.dueDate || 'No date'}</span>
                </div>
                <button 
                  onClick={() => dispatch({ type: 'DELETE_TASK', payload: task.id })}
                  className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-rose-500/50 hover:text-rose-500 hover:bg-rose-500/10 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
        title="Create new task">
        <form onSubmit={handleCreateTask} className="space-y-6">
          <FormInput 
            label="Task title" 
            value={formData.title} 
            onChange={(v) => setFormData({...formData, title: v})} 
            placeholder="What needs to be done?"
          />
          <FormTextarea 
            label="Description" 
            value={formData.description} 
            onChange={(v) => setFormData({...formData, description: v})} 
            placeholder="Add some details..."
          />
          <div className="grid grid-cols-2 gap-6">
            <FormSelect 
              label="Priority" 
              value={formData.priority} 
              onChange={(v) => setFormData({...formData, priority: v})}
              options={[
                { label: 'Low', value: 'low' },
                { label: 'Medium', value: 'medium' },
                { label: 'High', value: 'high' }
              ]}
            />
            <FormInput 
              label="Due date" 
              type="date"
              value={formData.dueDate} 
              onChange={(v) => setFormData({...formData, dueDate: v})} 
            />
          </div>
          <FormSelect 
            label="Assignee" 
            value={formData.assignee} 
            onChange={(v) => setFormData({...formData, assignee: v})} 
            options={[
              { value: '', label: 'Select Employee' },
              ...employees.filter(e => e.status === 'active').map(e => ({
                value: e.name,
                label: e.name.toUpperCase()
              }))
            ]}
          />
          <FormSelect 
            label="Initial status" 
            value={formData.status} 
            onChange={(v) => setFormData({...formData, status: v})}
            options={[
              { label: 'To Do', value: 'todo' },
              { label: 'In Progress', value: 'in_progress' },
              { label: 'Completed', value: 'completed' }
            ]}
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              className="bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white px-8"
              onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary-600 hover:bg-primary-500 px-8 border-0">
              Create task
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
