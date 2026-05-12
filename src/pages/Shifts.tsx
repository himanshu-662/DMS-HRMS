import { useState, useMemo } from 'react';
import {
  Clock, Plus, Users, Sun, Moon, Sunset
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';
import { FormInput, Button } from '../components/FormInput';
import { cn } from '../utils/cn';
import type { Shift } from '../types';

export default function Shifts() {
  const { state, dispatch, showToast } = useApp();
  const { shifts } = state;

  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    startTime: '09:00',
    endTime: '18:00',
    color: '#6366F1',
  });

  const totalEmployees = useMemo(() => shifts.reduce((s, sh) => s + sh.employees, 0), [shifts]);
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const handleAddShift = () => {
    if (!formData.name.trim()) {
      showToast('error', 'Validation Error', 'Please enter a shift name.');
      return;
    }

    const newShift: Shift = {
      id: `s${Date.now()}`,
      name: formData.name,
      startTime: formData.startTime,
      endTime: formData.endTime,
      employees: 0,
      color: formData.color,
    };

    dispatch({ type: 'ADD_SHIFT', payload: newShift });
    showToast('success', 'Shift Created', `${formData.name} has been created.`);
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setFormData({ name: '', startTime: '09:00', endTime: '18:00', color: '#6366F1' });
  };

  const shiftIcons: Record<string, React.ElementType> = {
    'Morning Shift': Sun,
    'General Shift': Clock,
    'Afternoon Shift': Sunset,
    'Night Shift': Moon,
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Shift Management</h3>
          <p className="text-sm text-gray-500">{totalEmployees} employees across {shifts.length} shifts</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={() => setShowAddModal(true)}>
          Create Shift
        </Button>
      </div>

      {/* Shift Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {shifts.map(shift => {
          const ShiftIcon = shiftIcons[shift.name] || Clock;
          return (
            <div key={shift.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:shadow-gray-100/50 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: `${shift.color}15` }}
                >
                  <ShiftIcon className="w-6 h-6" style={{ color: shift.color }} />
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-sm font-semibold text-gray-700">{shift.employees}</span>
                </div>
              </div>
              <h4 className="text-base font-semibold text-gray-900">{shift.name}</h4>
              <p className="text-sm text-gray-500 mt-1">
                {shift.startTime} — {shift.endTime}
              </p>
              <div className="mt-4 flex gap-1">
                {weekDays.map(day => (
                  <span
                    key={day}
                    className="flex-1 text-center text-[10px] font-semibold py-1 rounded-lg"
                    style={{
                      backgroundColor: day === 'Sat' || day === 'Sun' ? '#f3f4f6' : `${shift.color}15`,
                      color: day === 'Sat' || day === 'Sun' ? '#9CA3AF' : shift.color,
                    }}
                  >
                    {day}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Weekly Schedule */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Weekly Schedule Overview</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500 uppercase w-40">Shift</th>
                {weekDays.map(day => (
                  <th key={day} className="text-center px-3 py-2 text-xs font-semibold text-gray-500 uppercase">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shifts.map(shift => (
                <tr key={shift.id} className="border-b border-gray-50">
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: shift.color }} />
                      <span className="text-sm font-medium text-gray-900">{shift.name}</span>
                    </div>
                  </td>
                  {weekDays.map(day => {
                    const isWeekend = day === 'Sat' || day === 'Sun';
                    const count = isWeekend ? Math.floor(shift.employees * 0.3) : shift.employees;
                    return (
                      <td key={day} className="text-center px-3 py-3">
                        <span
                          className={cn(
                            'text-xs font-semibold px-2.5 py-1 rounded-lg inline-block min-w-[36px]',
                            isWeekend ? 'bg-gray-50 text-gray-400' : ''
                          )}
                          style={!isWeekend ? {
                            backgroundColor: `${shift.color}15`,
                            color: shift.color,
                          } : {}}
                        >
                          {count}
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
        title="Create New Shift"
        subtitle="Define a new work shift"
        footer={
          <>
            <Button variant="ghost" onClick={handleCloseModal}>Cancel</Button>
            <Button onClick={handleAddShift}>Create Shift</Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormInput
            label="Shift Name"
            value={formData.name}
            onChange={(v) => setFormData({ ...formData, name: v })}
            placeholder="Morning Shift"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Start Time"
              type="time"
              value={formData.startTime}
              onChange={(v) => setFormData({ ...formData, startTime: v })}
            />
            <FormInput
              label="End Time"
              type="time"
              value={formData.endTime}
              onChange={(v) => setFormData({ ...formData, endTime: v })}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Color</label>
            <div className="flex gap-2">
              {['#6366F1', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#06B6D4'].map(color => (
                <button
                  key={color}
                  onClick={() => setFormData({ ...formData, color })}
                  className={cn(
                    'w-8 h-8 rounded-lg transition-transform',
                    formData.color === color && 'scale-110 ring-2 ring-offset-2 ring-gray-300'
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
