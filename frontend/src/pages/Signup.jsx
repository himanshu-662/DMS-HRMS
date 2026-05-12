import { useState } from 'react';
import { Zap, Mail, Lock, User as UserIcon, ArrowRight, ArrowLeft, Moon, Sun, Shield, Users, Briefcase } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../utils/cn';





export default function Signup({ onBackToLogin }) {
  const { state, dispatch, signup } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';else
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.password) newErrors.password = 'Password is required';else
    if (formData.password.length < 6) newErrors.password = 'Min 6 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    const success = await signup(formData.name, formData.email, formData.password, formData.role);
    setIsLoading(false);
    if (success) {
      dispatch({ type: 'SET_SHOW_LANDING', payload: false });
    }
  };

  const handleBackToLogin = () => {
    onBackToLogin();
    // Also reset show landing if they came from there
    dispatch({ type: 'SET_SHOW_LANDING', payload: false });
  };

  const roles = [
  { id: 'hr_admin', name: 'Admin', icon: Shield, desc: 'Full system access' },
  { id: 'manager', name: 'Manager', icon: Briefcase, desc: 'Team management' },
  { id: 'employee', name: 'Employee', icon: Users, desc: 'Self service portal' }];


  return (
    <div className={cn('min-h-screen flex items-center justify-center p-4 transition-colors duration-500', state.darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-violet-600 via-primary-600 to-primary-800')}>
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
        <button onClick={handleBackToLogin} className="flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-all group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to login
        </button>
        <button onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })} className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md hover:bg-white/20 flex items-center justify-center transition-all border border-white/10 shadow-lg">
          {state.darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-white" />}
        </button>
      </div>

      <div className="w-full max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl mb-6 group cursor-default">
            <Zap className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-300" />
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">Create Account</h1>
          <p className="text-primary-100/80 mt-2 text-lg">Join the DMS HRMS ecosystem today</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/10">
          <form onSubmit={handleSubmit} className="p-8 lg:p-10 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-700/50 rounded-2xl text-sm border-2 border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-gray-700 transition-all outline-none"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      required
                      placeholder="john@company.com"
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-700/50 rounded-2xl text-sm border-2 border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-gray-700 transition-all outline-none"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-700/50 rounded-2xl text-sm border-2 border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-gray-700 transition-all outline-none"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                    
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Select Role</label>
                {roles.map((role) =>
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, role: role.id })}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left group",
                    formData.role === role.id ?
                    "border-primary-500 bg-primary-50 dark:bg-primary-900/20" :
                    "border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600"
                  )}>
                  
                    <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                    formData.role === role.id ? "bg-primary-500 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-500"
                  )}>
                      <role.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className={cn("text-sm font-bold", formData.role === role.id ? "text-primary-700 dark:text-primary-300" : "text-gray-900 dark:text-white")}>{role.name}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider">{role.desc}</p>
                    </div>
                  </button>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white text-base font-bold rounded-2xl transition-all shadow-xl shadow-primary-600/30 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50">
              
              {isLoading ?
              <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" /> :

              <>Get Started Now <ArrowRight className="w-5 h-5" /></>
              }
            </button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-gray-100 dark:border-gray-700"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-xs font-medium uppercase tracking-widest">Or Signup with</span>
              <div className="flex-grow border-t border-gray-100 dark:border-gray-700"></div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {['Google', 'Microsoft', 'Apple'].map((provider) =>
              <button
                key={provider}
                type="button"
                className="flex flex-col items-center justify-center gap-2 py-4 border border-gray-100 dark:border-gray-700 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all group">
                
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {provider === 'Google' &&
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                  }
                    {provider === 'Microsoft' &&
                  <svg className="w-4 h-4" viewBox="0 0 23 23">
                         <path fill="#f35325" d="M1 1h10v10H1z" /><path fill="#81bc06" d="M12 1h10v10H12z" /><path fill="#05a6f0" d="M1 12h10v10H1z" /><path fill="#ffba08" d="M12 12h10v10H12z" />
                       </svg>
                  }
                    {provider === 'Apple' &&
                  <svg className="w-4 h-4 dark:fill-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.05 20.28c-.96.95-2.04 1.72-3.23 1.72-1.12 0-1.46-.68-2.82-.68-1.35 0-1.74.66-2.82.66-1.16 0-2.35-.86-3.32-1.83C3 18.15 1.42 14.65 1.42 11.23c0-3.37 2.12-5.15 4.14-5.15 1.07 0 2.08.75 2.74.75.65 0 1.9-.88 3.19-.88 1.62 0 2.83.86 3.6 2 0 .01-.01.01-.02.02-1.35.81-1.61 2.62-.35 3.51.01.01.02.01.03.02 0 .01-.01.01-.01.02-.45 1.34-1.57 3.06-2.7 4.77zM12.03 5.07c.01-.05.01-.1.02-.15.42-2.18 2.37-3.92 4.46-4.05.05 0 .1 0 .15.01.21 2.17-1.83 4.11-4.06 4.61-.17.04-.37.07-.57.08v-.5z" />
                      </svg>
                  }
                  </div>
                  <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">{provider}</span>
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>);

}