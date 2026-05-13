import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../utils/cn';

export default function ToastContainer() {
  const { state, dispatch } = useApp();

  const icons = {
    success: CheckCircle2,
    error: XCircle,
    warning: AlertTriangle,
    info: Info
  };

  const colors = {
    success: 'bg-zinc-900 border-emerald-500/30 text-zinc-100',
    error: 'bg-zinc-900 border-red-500/30 text-zinc-100',
    warning: 'bg-zinc-900 border-amber-500/30 text-zinc-100',
    info: 'bg-zinc-900 border-blue-500/30 text-zinc-100'
  };

  const iconColors = {
    success: 'text-emerald-500',
    error: 'text-red-500',
    warning: 'text-amber-500',
    info: 'text-blue-500'
  };

  if (state.toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2 max-w-sm w-full">
      {state.toasts.map((toast) => {
        const Icon = icons[toast.type];
        return (
          <div
            key={toast.id}
            className={cn(
              'flex items-start gap-3 p-4 rounded-xl border shadow-lg animate-slide-in',
              colors[toast.type]
            )}>
            
            <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', iconColors[toast.type])} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">{toast.title}</p>
              {toast.message &&
              <p className="text-xs mt-0.5 opacity-80">{toast.message}</p>
              }
            </div>
            <button
              onClick={() => dispatch({ type: 'REMOVE_TOAST', payload: toast.id })}
              className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity">
              
              <X className="w-4 h-4" />
            </button>
          </div>);

      })}
    </div>);

}