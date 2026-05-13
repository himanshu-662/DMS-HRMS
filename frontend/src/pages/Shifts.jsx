import { useState, useMemo } from 'react';
import {
  Clock, Plus, Users, Sun, Moon, Sunset } from
'lucide-react';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';
import { FormInput, Button } from '../components/FormInput';
import { cn } from '../utils/cn';


export default function Shifts() {
  const { state, dispatch, showToast } = useApp();
  const { shifts } = state;

  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    startTime: '09:00',
    endTime: '18:00',
    color: '#6366F1'
  });

  // employees field may be an array or a number
  const getCount = (sh) => Array.isArray(sh.employees) ? sh.employees.length : (sh.assignedCount || sh.employees || 0);
  const totalEmployees = useMemo(() => shifts.reduce((s, sh) => s + getCount(sh), 0), [shifts]);
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const handleAddShift = () => {
    if (!formData.name.trim()) {
      showToast('error', 'Validation Error', 'Shift name is required.');
      return;
    }

    const newShift = {
      id: `s${Date.now()}`,
      name: formData.name,
      startTime: formData.startTime,
      endTime: formData.endTime,
      employees: 0,
      color: formData.color
    };

    dispatch({ type: 'ADD_SHIFT', payload: newShift });
    showToast('success', 'Shift Created', `${formData.name} has been added.`);
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setFormData({ name: '', startTime: '09:00', endTime: '18:00', color: '#6366F1' });
  };

  const shiftIcons = {
    'Morning Shift': Sun,
    'General Shift': Clock,
    'Afternoon Shift': Sunset,
    'Night Shift': Moon
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Shift Management</h1>
          <p className="text-sm text-zinc-500 mt-1">
            {getCount(shifts[0] ?? {})} employees · {shifts.length} active shifts
          </p>
        </div>
        <Button 
          className="h-11 px-6 rounded-xl text-xs font-bold bg-primary-600 hover:bg-primary-500 border-0"
          onClick={() => setShowAddModal(true)}
          icon={<Plus className="w-4 h-4" />}>
          Add New Shift
        </Button>
      </div>

      {/* Shift Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {shifts.map((shift) => {
          const ShiftIcon = shiftIcons[shift.name] || Clock;
          return (
            <div key={shift.id} className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 group hover:border-zinc-700 transition-all">
              <div className="flex items-start justify-between mb-6">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center border border-zinc-800 bg-zinc-950 shadow-inner"
                  style={{ backgroundColor: `${shift.color}10`, borderColor: `${shift.color}20` }}>
                  <ShiftIcon className="w-6 h-6" style={{ color: shift.color }} />
                </div>
                <div className="flex items-center gap-2 px-2.5 py-1.5 bg-zinc-950 rounded-lg border border-zinc-800">
                  <Users className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="text-xs font-bold text-white">{getCount(shift)}</span>
                </div>
              </div>
              
              <h4 className="text-lg font-bold text-white group-hover:text-primary-400 transition-colors">{shift.name}</h4>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mt-1">
                Time: {shift.startTime} — {shift.endTime}
              </p>
              
              <div className="mt-6 flex gap-1">
                {weekDays.map((day) => (
                  <span
                    key={day}
                    className="flex-1 text-center text-[9px] font-bold py-1.5 rounded border uppercase tracking-wider transition-all"
                    style={{
                      backgroundColor: day === 'Sat' || day === 'Sun' ? '#09090b' : `${shift.color}05`,
                      borderColor: day === 'Sat' || day === 'Sun' ? '#18181b' : `${shift.color}15`,
                      color: day === 'Sat' || day === 'Sun' ? '#3f3f46' : shift.color
                    }}>
                    {day[0]}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Weekly Schedule */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8 shadow-xl">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Weekly Schedule</h3>
            <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-wider font-bold italic">Shift distributions across locations</p>
          </div>
          <Clock className="w-5 h-5 text-zinc-700" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-y-3">
            <thead>
              <tr>
                <th className="text-left px-6 py-2 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Shift Name</th>
                {weekDays.map((day) => (
                  <th key={day} className="text-center px-4 py-2 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shifts.map((shift) => (
                <tr key={shift.id} className="group">
                  <td className="px-6 py-4 bg-zinc-950 rounded-l-xl border-y border-l border-zinc-800">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: shift.color }} />
                      <span className="text-xs font-bold text-white group-hover:text-primary-400 transition-colors uppercase tracking-wider">{shift.name}</span>
                    </div>
                  </td>
                  {weekDays.map((day, idx) => {
                    const isWeekend = day === 'Sat' || day === 'Sun';
                    const count = isWeekend ? Math.floor(getCount(shift) * 0.3) : getCount(shift);
                    return (
                      <td key={day} className={cn(
                        "text-center px-4 py-4 bg-zinc-950 border-y border-zinc-800",
                        idx === weekDays.length - 1 ? "rounded-r-xl border-r" : ""
                      )}>
                        <span
                          className={cn(
                            'text-[9px] font-bold px-3 py-1 rounded border uppercase tracking-wider',
                            isWeekend ? 'bg-zinc-900 text-zinc-700 border-zinc-800/50' : ''
                          )}
                          style={!isWeekend ? {
                            backgroundColor: `${shift.color}05`,
                            borderColor: `${shift.color}20`,
                            color: shift.color
                          } : {}}>
                          {count} Emps
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Shift Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={handleCloseModal}
        title="Add New Shift"
        subtitle="Define shift timing and appearance."
        size="lg"
        footer={
          <div className="flex gap-3">
            <Button className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 h-11 px-6 rounded-xl text-xs font-bold" onClick={handleCloseModal}>Cancel</Button>
            <Button className="bg-primary-600 hover:bg-primary-500 h-11 px-8 rounded-xl text-xs font-bold border-0" onClick={handleAddShift}>Create Shift</Button>
          </div>
        }>
        
        <div className="space-y-6">
          <FormInput
            label="Shift Name"
            value={formData.name}
            onChange={(v) => setFormData({ ...formData, name: v })}
            placeholder="e.g. General Shift"
            required />
          
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Start Time"
              type="time"
              value={formData.startTime}
              onChange={(v) => setFormData({ ...formData, startTime: v })} />
            
            <FormInput
              label="End Time"
              type="time"
              value={formData.endTime}
              onChange={(v) => setFormData({ ...formData, endTime: v })} />
          </div>

          <div>
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-3 block">Shift Color</label>
            <div className="flex flex-wrap gap-3 p-4 bg-zinc-950 rounded-xl border border-zinc-800">
              {['#6366F1', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#06B6D4'].map((color) => (
                <button
                  key={color}
                  onClick={() => setFormData({ ...formData, color })}
                  className={cn(
                    'w-8 h-8 rounded-lg transition-all relative',
                    formData.color === color ? 'ring-2 ring-primary-500 ring-offset-2 ring-offset-zinc-950' : 'opacity-40 hover:opacity-100'
                  )}
                  style={{ backgroundColor: color }} />
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

