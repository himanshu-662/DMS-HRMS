import { X } from 'lucide-react';
import { useEffect } from 'react';











export default function Modal({ isOpen, onClose, title, subtitle, children, size = 'md', footer }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}>
      
      <div
        className={`bg-zinc-900 border border-zinc-800/50 rounded-[2.5rem] w-full ${sizes[size]} max-h-[95vh] flex flex-col animate-scale-in shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] relative overflow-hidden`}
        onClick={(e) => e.stopPropagation()}>
        
        {/* Top Gradient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />

        <div className="flex items-center justify-between p-8 border-b border-zinc-800/50">
          <div>
            <h3 className="text-xl font-black text-white tracking-tight uppercase tracking-widest text-sm">{title}</h3>
            {subtitle && <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest mt-2">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all active:scale-90">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {children}
        </div>
        
        {footer &&
        <div className="p-8 border-t border-zinc-800/50 flex items-center justify-end gap-4 bg-zinc-950/30">
            {footer}
          </div>
        }
      </div>
    </div>);
}