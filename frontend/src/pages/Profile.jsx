import { useState } from 'react';
import {
  Mail, Phone, MapPin, Building2, Calendar, Briefcase,
  Award, Shield, Edit, Camera, Save, Key, Check, Trash2, Globe, Lock } from 'lucide-react';
import { useApp, api } from '../context/AppContext';
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
  const [orgFormData, setOrgFormData] = useState({
    company_name: currentUser?.organization?.company_name || '',
    website: currentUser?.organization?.website || '',
    address: currentUser?.organization?.address || '',
    city: currentUser?.organization?.city || '',
    state: currentUser?.organization?.state || '',
    country: currentUser?.organization?.country || '',
    zip_code: currentUser?.organization?.zip_code || '',
    registration_number: currentUser?.organization?.registration_number || '',
    tax_id: currentUser?.organization?.tax_id || '',
    phone: currentUser?.organization?.phone || '',
    email: currentUser?.organization?.email || '',
  });
  const [showOrgModal, setShowOrgModal] = useState(false);
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
  const [pwError, setPwError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Derived stats
  const myLeaves = leaveRequests.filter((l) => l.employeeId === currentUser?.id || l.employeeName === currentUser?.name);
  const approvedLeaves = myLeaves.filter((l) => l.status === 'approved').reduce((s, l) => s + (l.days || 0), 0);
  const myAssets = assets.filter((a) => a.assignedTo === currentUser?.name);
  const attendanceRate = attendance.length > 0
    ? (attendance.filter((a) => a.status === 'present' || a.status === 'wfh').length / attendance.length * 100).toFixed(1)
    : '98.0';

  const [isOrgLogoUploading, setIsOrgLogoUploading] = useState(false);

  const handleOrgSave = async () => {
    try {
      await api.post('/api/organization/profile', orgFormData);
      
      // Update currentUser in state
      dispatch({
        type: 'SET_DATA',
        payload: {
          currentUser: {
            ...currentUser,
            organization: {
              ...currentUser.organization,
              company_name: orgFormData.company_name,
              website: orgFormData.website,
              address: orgFormData.address,
              city: orgFormData.city,
              state: orgFormData.state,
              country: orgFormData.country,
              zip_code: orgFormData.zip_code,
              registration_number: orgFormData.registration_number,
              tax_id: orgFormData.tax_id,
              phone: orgFormData.phone,
              email: orgFormData.email
            }
          }
        }
      });
      showToast('success', 'Organization updated', 'Company details have been saved.');
      setShowOrgModal(false);
    } catch (err) {
      showToast('error', 'Update failed', err.response?.data?.detail || 'Could not save organization changes.');
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast('error', 'File too large', 'Please upload an image smaller than 2MB.');
      return;
    }

    setIsOrgLogoUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64String = reader.result;
        const response = await api.post('/api/organization/logo', { logo: base64String });

        if (response.data) {
          dispatch({
            type: 'SET_DATA',
            payload: { 
              currentUser: { 
                ...currentUser, 
                organization: { ...currentUser.organization, logo: base64String } 
              } 
            }
          });
          showToast('success', 'Logo updated', 'Organization logo has been updated.');
        }
      } catch (err) {
        showToast('error', 'Upload failed', err.response?.data?.detail || 'Could not save organization logo.');
      } finally {
        setIsOrgLogoUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      showToast('error', 'Validation Error', 'Name cannot be empty.');
      return;
    }
    
    try {
      await api.post('/api/user/profile', formData);
      
      // Update currentUser in state
      dispatch({
        type: 'SET_DATA',
        payload: {
          currentUser: {
            ...currentUser,
            ...formData
          }
        }
      });
      showToast('success', 'Profile updated', 'Your information has been saved permanently.');
      setShowEditModal(false);
    } catch (err) {
      showToast('error', 'Update failed', err.response?.data?.detail || 'Could not save profile changes.');
    }
  };

  const handlePasswordChange = async () => {
    setPwError('');
    if (!pwForm.current) { setPwError('Current password is required.'); return; }
    if (pwForm.newPw.length < 6) { setPwError('New password must be at least 6 characters.'); return; }
    if (pwForm.newPw !== pwForm.confirm) { setPwError('Passwords do not match.'); return; }
    
    try {
      await api.post('/api/user/change-password', pwForm);
      showToast('success', 'Password changed', 'Your password has been updated successfully.');
      setPwForm({ current: '', newPw: '', confirm: '' });
      setShowPasswordModal(false);
    } catch (err) {
      setPwError(err.response?.data?.detail || 'Could not update password. Please check your current password.');
      showToast('error', 'Update failed', 'Password change failed.');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast('error', 'File too large', 'Please upload an image smaller than 2MB.');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64String = reader.result;
        const response = await api.post('/api/user/profile-image', { avatar: base64String });

        if (response.data) {
          dispatch({
            type: 'SET_DATA',
            payload: { currentUser: { ...currentUser, avatar: base64String } }
          });
          showToast('success', 'Image updated', 'Profile picture has been updated.');
        }
      } catch (err) {
        showToast('error', 'Upload failed', err.response?.data?.detail || 'Could not save profile image.');
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = async () => {
    try {
      const defaultAvatar = `https://ui-avatars.com/api/?name=${currentUser?.name.replace(' ', '+')}&background=random`;
      const response = await api.post('/api/user/profile-image', { avatar: defaultAvatar });

      if (response.data) {
        dispatch({
          type: 'SET_DATA',
          payload: { currentUser: { ...currentUser, avatar: defaultAvatar } }
        });
        showToast('success', 'Image removed', 'Reverted to default avatar.');
      }
    } catch (err) {
      showToast('error', 'Action failed', 'Could not remove profile image.');
    }
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
              <div className="relative group">
                <div className="w-28 h-28 rounded-3xl bg-zinc-900 p-1 border border-zinc-800 shadow-2xl relative overflow-hidden">
                  {currentUser?.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover rounded-2xl" />
                  ) : (
                    <div className="w-full h-full rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                      <span className="text-3xl font-bold text-white">{initials}</span>
                    </div>
                  )}
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 flex gap-1">
                  {currentUser?.avatar && !currentUser.avatar.includes('ui-avatars') && (
                    <button 
                      onClick={handleRemoveImage}
                      className="w-8 h-8 rounded-xl bg-red-500 text-white shadow-lg flex items-center justify-center border border-red-400 hover:scale-110 active:scale-95 transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <label className="w-8 h-8 rounded-xl bg-white text-black shadow-lg flex items-center justify-center border border-zinc-200 hover:scale-110 active:scale-95 transition-all cursor-pointer">
                    <Camera className="w-4 h-4" />
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                  </label>
                </div>
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

          {/* Organization Details (for Admins) */}
          {(currentUser?.role === 'hr_admin' || currentUser?.role === 'super_admin' || currentUser?.role === 'admin') && (
            <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-8 lg:p-10 shadow-xl">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <div className="w-16 h-16 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center overflow-hidden shadow-lg">
                      {currentUser?.organization?.logo ? (
                        <img src={currentUser.organization.logo} alt="" className="w-full h-full object-contain p-2" />
                      ) : (
                        <Building2 className="w-8 h-8 text-zinc-700" />
                      )}
                      {isOrgLogoUploading && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                    </div>
                    <label className="absolute -bottom-2 -right-2 w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white cursor-pointer hover:bg-zinc-700 transition-all shadow-xl">
                      <Camera className="w-3.5 h-3.5" />
                      <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} disabled={isOrgLogoUploading} />
                    </label>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Organization details</h3>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Manage company-wide profile information</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setOrgFormData({
                      company_name: currentUser?.organization?.company_name || '',
                      website: currentUser?.organization?.website || '',
                      address: currentUser?.organization?.address || '',
                      city: currentUser?.organization?.city || '',
                      state: currentUser?.organization?.state || '',
                      country: currentUser?.organization?.country || '',
                      zip_code: currentUser?.organization?.zip_code || '',
                      registration_number: currentUser?.organization?.registration_number || '',
                      tax_id: currentUser?.organization?.tax_id || '',
                      phone: currentUser?.organization?.phone || '',
                      email: currentUser?.organization?.email || '',
                    });
                    setShowOrgModal(true);
                  }}
                  icon={<Edit className="w-3 h-3" />}>
                  Edit Company
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Company Name', value: currentUser?.organization?.company_name || '', icon: Building2, color: 'text-blue-400' },
                  { label: 'Website', value: currentUser?.organization?.website || '', icon: Globe, color: 'text-emerald-400' },
                  { label: 'Registration No', value: currentUser?.organization?.registration_number || '', icon: Shield, color: 'text-amber-400' },
                  { label: 'Tax ID', value: currentUser?.organization?.tax_id || '', icon: Lock, color: 'text-pink-400' },
                  { label: 'Email', value: currentUser?.organization?.email || '', icon: Mail, color: 'text-violet-400' },
                  { label: 'Phone', value: currentUser?.organization?.phone || '', icon: Phone, color: 'text-cyan-400' },
                  { label: 'Address', value: currentUser?.organization?.address || '', icon: MapPin, color: 'text-primary-400' },
                  { label: 'Location', value: currentUser?.organization?.city ? `${currentUser?.organization?.city}, ${currentUser?.organization?.state || ''} ${currentUser?.organization?.zip_code || ''}` : '', icon: MapPin, color: 'text-zinc-400' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-950/50 border border-zinc-800 hover:border-zinc-700 transition-all group">
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                      <item.icon className={cn('w-4 h-4', item.color)} />
                    </div>
                    <div>
                      <p className="text-[9px] text-zinc-600 font-medium">{item.label}</p>
                      <p className="text-sm font-semibold text-white mt-0.5 truncate max-w-[150px]">{item.value || '—'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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
      
      {/* Organization Details Modal */}
      <Modal
        isOpen={showOrgModal}
        onClose={() => setShowOrgModal(false)}
        title="Edit organization"
        subtitle="Update your company profile information."
        size="lg"
        footer={
          <div className="flex gap-3">
            <Button className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 h-11 px-6 rounded-xl text-xs font-bold" onClick={() => setShowOrgModal(false)}>Cancel</Button>
            <Button className="bg-primary-600 hover:bg-primary-500 h-11 px-8 rounded-xl text-xs font-bold border-0" onClick={handleOrgSave} icon={<Save className="w-4 h-4" />}>Save Company</Button>
          </div>
        }>
        
        <div className="space-y-6 p-1 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput label="Company Name" value={orgFormData.company_name} onChange={(v) => setOrgFormData({ ...orgFormData, company_name: v })} placeholder="Enter company name" required />
            <FormInput label="Website" value={orgFormData.website} onChange={(v) => setOrgFormData({ ...orgFormData, website: v })} placeholder="https://example.com" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput label="Company Email" value={orgFormData.email} onChange={(v) => setOrgFormData({ ...orgFormData, email: v })} placeholder="contact@company.com" />
            <FormInput label="Company Phone" value={orgFormData.phone} onChange={(v) => setOrgFormData({ ...orgFormData, phone: v })} placeholder="+1-555-0199" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-zinc-800 pt-4">
            <FormInput label="Registration Number" value={orgFormData.registration_number} onChange={(v) => setOrgFormData({ ...orgFormData, registration_number: v })} placeholder="REG-123456" />
            <FormInput label="Tax ID / VAT" value={orgFormData.tax_id} onChange={(v) => setOrgFormData({ ...orgFormData, tax_id: v })} placeholder="TAX-789012" />
          </div>

          <div className="space-y-4 pt-4 border-t border-zinc-800">
            <FormInput label="Street Address" value={orgFormData.address} onChange={(v) => setOrgFormData({ ...orgFormData, address: v })} placeholder="123 Business St" />
            <div className="grid grid-cols-2 gap-4">
              <FormInput label="City" value={orgFormData.city} onChange={(v) => setOrgFormData({ ...orgFormData, city: v })} placeholder="City" />
              <FormInput label="State/Province" value={orgFormData.state} onChange={(v) => setOrgFormData({ ...orgFormData, state: v })} placeholder="State" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormInput label="Country" value={orgFormData.country} onChange={(v) => setOrgFormData({ ...orgFormData, country: v })} placeholder="Country" />
              <FormInput label="Zip/Postal Code" value={orgFormData.zip_code} onChange={(v) => setOrgFormData({ ...orgFormData, zip_code: v })} placeholder="12345" />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
