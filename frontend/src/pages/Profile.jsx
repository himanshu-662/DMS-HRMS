import { useState } from 'react';
import {
  Mail, Phone, MapPin, Building2, Calendar, Briefcase,
  Award, Shield, Edit, Camera, Save, Key, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';
import { FormInput, Button } from '../components/FormInput';
import { cn } from '../utils/cn';

export default function Profile() {
  const { state, dispatch, showToast } = useApp();
  const { currentUser, leaveRequests, attendance, assets } = state;

  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '+1-555-0100',
    location: currentUser?.location || 'New York, NY',
    designation: currentUser?.designation || '',
    department: currentUser?.department || '',
  });
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
  const [pwError, setPwError] = useState('');

  // Derived stats
  const myLeaves = leaveRequests.filter((l) => l.employeeId === currentUser?.id || l.employeeName === currentUser?.name);
  const approvedLeaves = myLeaves.filter((l) => l.status === 'approved').reduce((s, l) => s + (l.days || 0), 0);
  const myAssets = assets.filter((a) => a.assignedTo === currentUser?.name);
  const attendanceRate = attendance.length > 0
    ? (attendance.filter((a) => a.status === 'present' || a.status === 'wfh').length / attendance.length * 100).toFixed(1)
    : '98.0';

  const handleSave = () => {
    if (!formData.name.trim()) {
      showToast('error', 'Validation Error', 'Name cannot be empty.');
      return;
    }
    // Update currentUser in state
    dispatch({
      type: 'SET_DATA',
      payload: {
        currentUser: {
          ...currentUser,
          name: formData.name,
          phone: formData.phone,
          location: formData.location,
          designation: formData.designation,
          department: formData.department,
        }
      }
    });
    showToast('success', 'Profile updated', 'Your information has been saved.');
    setShowEditModal(false);
  };

  const handlePasswordChange = () => {
    setPwError('');
    if (!pwForm.current) { setPwError('Current password is required.'); return; }
    if (pwForm.newPw.length < 6) { setPwError('New password must be at least 6 characters.'); return; }
    if (pwForm.newPw !== pwForm.confirm) { setPwError('Passwords do not match.'); return; }
    showToast('success', 'Password changed', 'Your password has been updated successfully.');
    setPwForm({ current: '', newPw: '', confirm: '' });
    setShowPasswordModal(false);
  };

  const initials = currentUser?.name?.split(' ').map((n) => n[0]).join('') || '?';

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Profile Header */}
      <div className="relative overflow-hidden rounded-[2rem] bg-zinc-900 border border-zinc-800 shadow-xl">
        <div className="h-40 bg-zinc-950 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-zinc-900 to-transparent" />
        </div>
        
        <div className="relative z-10 px-8 pb-8 -mt-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col md:flex-row items-end gap-6">
              <div className="relative">
                <div className="w-28 h-28 rounded-3xl bg-zinc-900 p-1 border border-zinc-800 shadow-2xl">
                  <div className="w-full h-full rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center overflow-hidden">
                    <span className="text-3xl font-bold text-white">{initials}</span>
                  </div>
                </div>
                <button className="absolute bottom-1 right-1 w-8 h-8 rounded-xl bg-white text-black shadow-lg flex items-center justify-center border border-zinc-200 hover:scale-110 active:scale-95 transition-all">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              
              <div className="mb-1">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-emerald-500/10 rounded-lg mb-3 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[9px] font-bold text-emerald-400">active</span>
                </div>
                <h2 className="text-3xl font-bold text-white tracking-tight leading-none">{currentUser?.name}</h2>
                <p className="mt-2 text-zinc-500 text-sm">
                  {formData.designation || currentUser?.designation} · <span className="text-primary-400">{formData.department || currentUser?.department}</span>
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 mb-1">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-zinc-950/50 border border-zinc-800 rounded-xl">
                <Shield className="w-4 h-4 text-primary-500" />
                <span className="text-xs font-medium text-white capitalize">
                  {currentUser?.role?.replace('_', ' ')}
                </span>
              </div>
              <Button
                className="h-11 px-5 rounded-xl text-xs font-bold bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700"
                onClick={() => setShowPasswordModal(true)}
                icon={<Key className="w-4 h-4" />}>
                Password
              </Button>
              <Button
                className="h-11 px-6 rounded-xl text-xs font-bold bg-white text-black hover:bg-zinc-200 border-0"
                onClick={() => {
                  setFormData({
                    name: currentUser?.name || '',
                    phone: currentUser?.phone || '+1-555-0100',
                    location: currentUser?.location || 'New York, NY',
                    designation: currentUser?.designation || '',
                    department: currentUser?.department || '',
                  });
                  setShowEditModal(true);
                }}
                icon={<Edit className="w-4 h-4" />}>
                Edit profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-8 lg:p-10 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-8">Personal information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Full name', value: currentUser?.name || '', icon: Briefcase, color: 'text-blue-400' },
                { label: 'Email address', value: currentUser?.email || '', icon: Mail, color: 'text-emerald-400' },
                { label: 'Phone', value: currentUser?.phone || formData.phone, icon: Phone, color: 'text-amber-400' },
                { label: 'Location', value: currentUser?.location || formData.location, icon: MapPin, color: 'text-primary-400' },
                { label: 'Department', value: currentUser?.department || formData.department, icon: Building2, color: 'text-violet-400' },
                { label: 'Designation', value: currentUser?.designation || formData.designation, icon: Award, color: 'text-pink-400' },
                { label: 'Joined', value: 'March 2020', icon: Calendar, color: 'text-cyan-400' },
                { label: 'Employee ID', value: `DMS-${Math.abs(currentUser?.id?.slice(0,4) || '0001')}`, icon: Shield, color: 'text-zinc-400' }
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-950/50 border border-zinc-800 hover:border-zinc-700 transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <item.icon className={cn('w-4 h-4', item.color)} />
                  </div>
                  <div>
                    <p className="text-[9px] text-zinc-600 font-medium">{item.label}</p>
                    <p className="text-sm font-semibold text-white mt-0.5">{item.value || '—'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-8 lg:p-10 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-8">Career history</h3>
            <div className="space-y-6 ml-2">
              {[
                { role: currentUser?.designation || 'HR Director', dept: currentUser?.department || 'Human Resources', period: 'Jan 2023 — Present', current: true },
                { role: 'HR Manager', dept: 'HR Operations', period: 'Mar 2021 — Dec 2022', current: false },
                { role: 'HR Associate', dept: 'HR Operations', period: 'Mar 2020 — Feb 2021', current: false }
              ].map((job, idx) => (
                <div key={idx} className="flex gap-6 group">
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      'w-3 h-3 rounded-full flex-shrink-0 mt-1.5 border-2',
                      job.current ? 'bg-primary-500 border-white' : 'bg-zinc-800 border-zinc-700'
                    )} />
                    {idx < 2 && <div className="w-px flex-1 bg-zinc-800 my-2" />}
                  </div>
                  <div className="pb-4">
                    <p className={cn('text-sm font-bold', job.current ? 'text-white' : 'text-zinc-500')}>{job.role}</p>
                    <p className="text-xs text-zinc-600 mt-0.5">{job.dept}</p>
                    <p className="text-[10px] text-primary-500/60 mt-2">{job.period}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-6">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {['HR strategy', 'Recruitment', 'Employee relations', 'Compliance', 'Performance', 'Training', 'Payroll'].map((skill) => (
                <span key={skill} className="text-[9px] font-medium px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-400 hover:border-primary-500/50 hover:text-white transition-all cursor-default">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-6">Statistics</h3>
            <div className="space-y-3">
              {[
                { label: 'Leave used', value: `${approvedLeaves} days`, color: 'text-primary-400' },
                { label: 'Attendance rate', value: `${attendanceRate}%`, color: 'text-emerald-400' },
                { label: 'Assets assigned', value: `${myAssets.length} items`, color: 'text-amber-400' },
                { label: 'Leave requests', value: `${myLeaves.length} total`, color: 'text-violet-400' },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center justify-between p-3.5 bg-zinc-950 border border-zinc-800/50 rounded-xl">
                  <span className="text-xs text-zinc-500">{stat.label}</span>
                  <span className={cn('text-xs font-bold', stat.color)}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-6">Emergency contact</h3>
            <div className="p-5 bg-zinc-950 border border-zinc-800 rounded-xl space-y-4">
              <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center">
                <Phone className="w-5 h-5 text-primary-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">John Johnson</p>
                <p className="text-xs text-zinc-600 mt-1">Spouse · Primary contact</p>
                <p className="text-sm font-bold text-primary-500 mt-3">+1-555-0199</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit profile"
        subtitle="Update your personal information below."
        size="lg"
        footer={
          <div className="flex gap-3">
            <Button className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 h-11 px-6 rounded-xl text-xs font-bold" onClick={() => setShowEditModal(false)}>Cancel</Button>
            <Button className="bg-primary-600 hover:bg-primary-500 h-11 px-8 rounded-xl text-xs font-bold border-0" onClick={handleSave} icon={<Save className="w-4 h-4" />}>Save changes</Button>
          </div>
        }>
        
        <div className="space-y-6 p-1">
          <FormInput label="Full name" value={formData.name} onChange={(v) => setFormData({ ...formData, name: v })} placeholder="Enter your full name" required />
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Phone" value={formData.phone} onChange={(v) => setFormData({ ...formData, phone: v })} placeholder="+1-XXX-XXXX" />
            <FormInput label="Location" value={formData.location} onChange={(v) => setFormData({ ...formData, location: v })} placeholder="City, Country" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Designation" value={formData.designation} onChange={(v) => setFormData({ ...formData, designation: v })} placeholder="Job title" />
            <FormInput label="Department" value={formData.department} onChange={(v) => setFormData({ ...formData, department: v })} placeholder="Department" />
          </div>
        </div>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => { setShowPasswordModal(false); setPwError(''); setPwForm({ current: '', newPw: '', confirm: '' }); }}
        title="Change password"
        subtitle="Enter your current password to set a new one."
        size="md"
        footer={
          <div className="flex gap-3">
            <Button className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 h-11 px-6 rounded-xl text-xs font-bold" onClick={() => setShowPasswordModal(false)}>Cancel</Button>
            <Button className="bg-primary-600 hover:bg-primary-500 h-11 px-8 rounded-xl text-xs font-bold border-0" onClick={handlePasswordChange} icon={<Check className="w-4 h-4" />}>Update password</Button>
          </div>
        }>
        
        <div className="space-y-5 p-1">
          <FormInput label="Current password" type="password" value={pwForm.current} onChange={(v) => setPwForm({ ...pwForm, current: v })} placeholder="••••••••" />
          <FormInput label="New password" type="password" value={pwForm.newPw} onChange={(v) => setPwForm({ ...pwForm, newPw: v })} placeholder="Min 6 characters" />
          <FormInput label="Confirm new password" type="password" value={pwForm.confirm} onChange={(v) => setPwForm({ ...pwForm, confirm: v })} placeholder="Re-enter new password" />
          {pwError && <p className="text-xs text-red-400 font-medium">{pwError}</p>}
        </div>
      </Modal>
    </div>
  );
}
