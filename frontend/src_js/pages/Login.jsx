import { useState } from 'react';
import { Zap, Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, Moon, Sun, Shield, Users, Briefcase } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../utils/cn';
export default function Login({ onGoToSignup }) {
    const { login, state, dispatch } = useApp();
    const [email, setEmail] = useState('admin@dms.com');
    const [password, setPassword] = useState('admin123');
    const [role, setRole] = useState('hr_admin');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const validateForm = () => {
        const newErrors = {};
        if (!email)
            newErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            newErrors.email = 'Invalid email';
        if (!password)
            newErrors.password = 'Password is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm())
            return;
        setIsLoading(true);
        const success = await login(email, password, role);
        setIsLoading(false);
    };
    const handleBackToLanding = () => {
        dispatch({ type: 'SET_SHOW_LANDING', payload: true });
    };
    const roles = [
        { id: 'hr_admin', name: 'Admin', icon: Shield },
        { id: 'manager', name: 'Manager', icon: Briefcase },
        { id: 'employee', name: 'Employee', icon: Users },
    ];
    return (<div className={cn('min-h-screen flex items-center justify-center p-4 transition-colors duration-500', state.darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-primary-600 via-primary-700 to-violet-800')}>
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
        <button onClick={handleBackToLanding} className="flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors">
          <ArrowLeft className="w-4 h-4"/> Back to home
        </button>
        <button onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })} className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
          {state.darkMode ? <Sun className="w-5 h-5 text-amber-400"/> : <Moon className="w-5 h-5 text-white"/>}
        </button>
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-lg mb-4">
            <Zap className="w-8 h-8 text-white"/>
          </div>
          <h1 className="text-3xl font-bold text-white">DMS HRMS</h1>
          <p className="text-primary-200 mt-2 text-sm uppercase tracking-widest font-semibold">Enterprise Resource Portal</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-white/10">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sign In</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Select your role and enter credentials</p>
          </div>

          {/* Role Selection */}
          <div className="flex gap-2 mb-8 p-1.5 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700">
            {roles.map((r) => (<button key={r.id} onClick={() => setRole(r.id)} className={cn("flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all", role === r.id
                ? "bg-white dark:bg-gray-700 shadow-md text-primary-600 dark:text-primary-400 border border-gray-100 dark:border-gray-600"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300")}>
                <r.icon className="w-4 h-4"/>
                <span className="text-[10px] font-bold uppercase">{r.name}</span>
              </button>))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-900/30 rounded-2xl text-sm border-2 border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-gray-700 transition-all outline-none" placeholder="you@company.com"/>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Password</label>
                <button type="button" className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline">Forgot?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-12 pr-12 py-3.5 bg-gray-50 dark:bg-gray-900/30 rounded-2xl text-sm border-2 border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-gray-700 transition-all outline-none" placeholder="••••••••"/>
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                  {showPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold rounded-2xl transition-all shadow-xl shadow-primary-600/30 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50">
              {isLoading ? (<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/>) : (<>Sign In <ArrowRight className="w-4 h-4"/></>)}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Don't have an account?{' '}
              <button onClick={onGoToSignup} className="text-primary-600 dark:text-primary-400 font-bold hover:underline">
                Create one
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>);
}
