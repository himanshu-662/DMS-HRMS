import { useState } from 'react';
import { Zap, Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, Shield, Users, Briefcase, Fingerprint } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../utils/cn';

export default function Login({ onGoToSignup }) {
  const { login, state, dispatch } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email address required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Invalid email format';
    if (!password) newErrors.password = 'Password required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    await login(email, password, role);
    setIsLoading(false);
  };

  const handleBackToLanding = () => {
    dispatch({ type: 'SET_SHOW_LANDING', payload: true });
  };

  const roles = [
    { id: 'hr_admin', name: 'Admin', icon: Shield },
    { id: 'manager', name: 'Manager', icon: Briefcase },
    { id: 'employee', name: 'Employee', icon: Users }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-950 relative overflow-hidden font-sans">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary-600/10 rounded-full blur-[150px] animate-float" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-600/10 rounded-full blur-[150px] animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 pattern-overlay opacity-30" />
      </div>

      <div className="absolute top-8 left-8">
        <button onClick={handleBackToLanding} className="flex items-center gap-2 text-zinc-500 hover:text-white text-[10px] font-black uppercase tracking-[0.3em] transition-all group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> BACK TO HOME
        </button>
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl mb-6">
            <Zap className="w-10 h-10 text-primary-500" />
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">Welcome <span className="text-primary-500">Back</span></h1>
          <p className="text-zinc-500 mt-2 text-sm font-medium">Please enter your details to login</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden p-8 lg:p-10">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-white">Login</h2>
            <p className="text-sm text-zinc-500 mt-1">Access your HR dashboard</p>
          </div>

          {/* Role Selection */}
          <div className="flex gap-2 mb-8 p-1 bg-zinc-950 rounded-xl border border-zinc-800">
            {roles.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={cn(
                  "flex-1 flex flex-col items-center gap-1.5 py-3 rounded-lg transition-all",
                  role === r.id ?
                  "bg-primary-600 text-white shadow-lg" :
                  "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
                )}>
                <r.icon className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">{r.name}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-400 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm font-medium text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all placeholder:text-zinc-700"
                  placeholder="name@company.com" />
              </div>
              {errors.email && <p className="text-[10px] text-red-500 ml-1 font-bold">{errors.email}</p>}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between ml-1">
                <label className="text-xs font-bold text-zinc-400">Password</label>
                <button type="button" className="text-[10px] font-bold text-primary-500 hover:text-primary-400">Forgot password?</button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm font-medium text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all placeholder:text-zinc-700"
                  placeholder="••••••••" />
                
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-[10px] text-red-500 ml-1 font-bold">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-primary-600 hover:bg-primary-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 mt-4 group">
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Login <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm font-medium text-zinc-500">
              Don't have an account?{' '}
              <button
                onClick={onGoToSignup}
                className="text-primary-500 font-bold hover:text-primary-400 ml-1">
                Create one
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
