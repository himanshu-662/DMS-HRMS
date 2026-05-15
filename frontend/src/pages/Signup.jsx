import { useState } from 'react';
import { Zap, Mail, Lock, User as UserIcon, ArrowRight, ArrowLeft, Shield, Users, Briefcase, Building2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../utils/cn';

export default function Signup({ onBackToLogin }) {
  const { state, dispatch, signup } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee',
    company_name: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email address required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password required';
    else if (formData.password.length < 6) newErrors.password = 'Minimum length not met (min 6)';
    if (formData.role === 'hr_admin' && !formData.company_name) newErrors.company_name = 'Company name required for admins';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    const success = await signup(formData.name, formData.email, formData.password, formData.role, formData.company_name);
    setIsLoading(false);
    if (success) {
      dispatch({ type: 'SET_SHOW_LANDING', payload: false });
    }
  };

  const handleBackToLogin = () => {
    onBackToLogin();
    dispatch({ type: 'SET_SHOW_LANDING', payload: false });
  };

  const roles = [
    { id: 'hr_admin', name: 'Admin', icon: Shield, desc: 'Full HR Access' },
    { id: 'manager', name: 'Manager', icon: Briefcase, desc: 'Team Management' },
    { id: 'employee', name: 'Employee', icon: Users, desc: 'Self-Service' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-950 font-sans">
      <div className="absolute top-8 left-8">
        <button onClick={handleBackToLogin} className="flex items-center gap-2 text-zinc-500 hover:text-white text-xs font-bold transition-all group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Login
        </button>
      </div>

      <div className="w-full max-w-2xl animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">Create Account</h1>
          <p className="text-zinc-500 mt-2 text-sm">Join the HR portal</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 ml-1">Full Name</label>
                  <div className="relative group">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-primary-500 transition-colors" />
                    <input
                      type="text"
                      required
                      placeholder="Enter your name"
                      className="w-full pl-11 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-sm font-medium text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all placeholder:text-zinc-700"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                  {errors.name && <p className="text-[10px] text-red-500 ml-1 font-bold">{errors.name}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-primary-500 transition-colors" />
                    <input
                      type="email"
                      required
                      placeholder="name@company.com"
                      className="w-full pl-11 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-sm font-medium text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all placeholder:text-zinc-700"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                  {errors.email && <p className="text-[10px] text-red-500 ml-1 font-bold">{errors.email}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 ml-1">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-primary-500 transition-colors" />
                    <input
                      type="password"
                      required
                      placeholder="Min 6 characters"
                      className="w-full pl-11 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-sm font-medium text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all placeholder:text-zinc-700"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                  </div>
                  {errors.password && <p className="text-[10px] text-red-500 ml-1 font-bold">{errors.password}</p>}
                </div>

                {formData.role === 'hr_admin' && (
                  <div className="space-y-1.5 animate-slide-in">
                    <label className="text-xs font-bold text-zinc-400 ml-1">Company Name</label>
                    <div className="relative group">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-primary-500 transition-colors" />
                      <input
                        type="text"
                        required
                        placeholder="Your organization name"
                        className="w-full pl-11 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-sm font-medium text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all placeholder:text-zinc-700"
                        value={formData.company_name}
                        onChange={(e) => setFormData({ ...formData, company_name: e.target.value })} />
                    </div>
                    {errors.company_name && <p className="text-[10px] text-red-500 ml-1 font-bold">{errors.company_name}</p>}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold text-zinc-400 ml-1 mb-2 block">Account Role</label>
                {roles.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: role.id })}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left",
                      formData.role === role.id ?
                      "border-primary-500 bg-primary-600/10" :
                      "border-zinc-800 bg-zinc-950 hover:border-zinc-700"
                    )}>
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center transition-all",
                      formData.role === role.id ? "bg-primary-600 text-white" : "bg-zinc-900 text-zinc-600"
                    )}>
                      <role.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className={cn("text-sm font-bold", formData.role === role.id ? "text-white" : "text-zinc-400")}>{role.name}</p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">{role.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-primary-600 hover:bg-primary-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 mt-10 group">
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Create Account <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>

            <div className="mt-10 pt-8 border-t border-zinc-800 flex flex-col items-center gap-4 text-center">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Already have an account?</p>
              <button
                onClick={handleBackToLogin}
                className="text-primary-500 font-bold hover:text-primary-400">
                Back to Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

