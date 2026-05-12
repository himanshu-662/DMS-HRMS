import { useState } from 'react';
import {
  Mail, Phone, MapPin, Building2, Calendar, Briefcase,
  Award, Shield, Edit, Camera, Save } from
'lucide-react';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';
import { FormInput, Button } from '../components/FormInput';
import { cn } from '../utils/cn';

export default function Profile() {
  const { state, showToast } = useApp();
  const { currentUser, leaveBalances, attendance } = state;

  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    phone: '+1-555-0100',
    location: 'New York, NY'
  });

  const handleSave = () => {
    showToast('success', 'Profile Updated', 'Your profile has been updated successfully.');
    setShowEditModal(false);
  };

  const totalLeaveBalance = leaveBalances.reduce((sum, b) => sum + b.remaining, 0);
  const attendanceRate = attendance.length > 0 ?
  (attendance.filter((a) => a.status === 'present' || a.status === 'wfh').length / attendance.length * 100).toFixed(1) :
  '0';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="h-40 bg-gradient-to-r from-primary-600 via-primary-500 to-violet-500 relative">
          <div className="absolute -bottom-12 left-6">
            <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-xl">
              <div className="w-full h-full rounded-xl bg-gradient-to-br from-violet-400 to-fuchsia-500 flex items-center justify-center text-white text-3xl font-bold">
                {currentUser?.name.split(' ').map((n) => n[0]).join('')}
              </div>
            </div>
            <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center border border-gray-100 hover:bg-gray-50 transition-colors">
              <Camera className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
        <div className="pt-14 px-6 pb-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{currentUser?.name}</h2>
              <p className="text-sm text-gray-500">{currentUser?.designation} · {currentUser?.department}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">Active</span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary-100 text-primary-700">
                  {currentUser?.role.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>
            <Button icon={<Edit className="w-4 h-4" />} onClick={() => setShowEditModal(true)}>
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
              { label: 'Full Name', value: currentUser?.name || '', icon: Briefcase },
              { label: 'Email', value: currentUser?.email || '', icon: Mail },
              { label: 'Phone', value: '+1-555-0100', icon: Phone },
              { label: 'Location', value: 'New York, NY', icon: MapPin },
              { label: 'Department', value: currentUser?.department || '', icon: Building2 },
              { label: 'Designation', value: currentUser?.designation || '', icon: Award },
              { label: 'Join Date', value: 'March 15, 2020', icon: Calendar },
              { label: 'Employee ID', value: 'DMS000', icon: Shield }].
              map((item) =>
              <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/80">
                  <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center border border-gray-100 flex-shrink-0">
                    <item.icon className="w-4 h-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400 font-medium uppercase">{item.label}</p>
                    <p className="text-sm font-medium text-gray-900">{item.value}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Work History */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Work History</h3>
            <div className="space-y-4">
              {[
              { role: 'HR Director', dept: 'Human Resources', period: 'Jan 2023 - Present', current: true },
              { role: 'Senior HR Manager', dept: 'Human Resources', period: 'Mar 2021 - Dec 2022', current: false },
              { role: 'HR Manager', dept: 'Human Resources', period: 'Mar 2020 - Feb 2021', current: false }].
              map((job, idx) =>
              <div key={idx} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={cn(
                    'w-3 h-3 rounded-full flex-shrink-0 mt-1.5',
                    job.current ? 'bg-primary-500' : 'bg-gray-300'
                  )} />
                    {idx < 2 && <div className="w-0.5 flex-1 bg-gray-200 mt-1" />}
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-semibold text-gray-900">{job.role}</p>
                    <p className="text-xs text-gray-500">{job.dept}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{job.period}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Skills */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {['HR Strategy', 'Recruitment', 'Employee Relations', 'HRIS', 'Compliance', 'Performance Management', 'Training', 'Payroll'].map((skill) =>
              <span key={skill} className="text-xs font-medium px-3 py-1.5 rounded-full bg-primary-50 text-primary-700 border border-primary-100">
                  {skill}
                </span>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-3">
              {[
              { label: 'Leave Balance', value: `${totalLeaveBalance} days` },
              { label: 'Attendance Rate', value: `${attendanceRate}%` },
              { label: 'Team Size', value: '12 members' },
              { label: 'Reviews Completed', value: '24' },
              { label: 'Assets Assigned', value: '3' }].
              map((stat) =>
              <div key={stat.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-500">{stat.label}</span>
                  <span className="text-sm font-semibold text-gray-900">{stat.value}</span>
                </div>
              )}
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Emergency Contact</h3>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-900">John Johnson</p>
              <p className="text-xs text-gray-500">Spouse</p>
              <p className="text-xs text-gray-500">+1-555-0199</p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Profile"
        subtitle="Update your personal information"
        footer={
        <>
            <Button variant="ghost" onClick={() => setShowEditModal(false)}>Cancel</Button>
            <Button icon={<Save className="w-4 h-4" />} onClick={handleSave}>Save Changes</Button>
          </>
        }>
        
        <div className="space-y-4">
          <FormInput
            label="Full Name"
            value={formData.name}
            onChange={(v) => setFormData({ ...formData, name: v })} />
          
          <FormInput
            label="Phone"
            value={formData.phone}
            onChange={(v) => setFormData({ ...formData, phone: v })} />
          
          <FormInput
            label="Location"
            value={formData.location}
            onChange={(v) => setFormData({ ...formData, location: v })} />
          
        </div>
      </Modal>
    </div>);

}