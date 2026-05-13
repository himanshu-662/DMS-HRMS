import { AlertTriangle, Trash2, CheckCircle2 } from 'lucide-react';
import Modal from './Modal';












export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'danger',
  confirmText = 'Confirm',
  cancelText = 'Cancel'
}) {
  const icons = {
    danger: Trash2,
    warning: AlertTriangle,
    success: CheckCircle2
  };

  const colors = {
    danger: {
      icon: 'bg-red-500/10 text-red-500',
      button: 'bg-red-600 hover:bg-red-700 shadow-red-600/25'
    },
    warning: {
      icon: 'bg-amber-500/10 text-amber-500',
      button: 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/25'
    },
    success: {
      icon: 'bg-emerald-500/10 text-emerald-500',
      button: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25'
    }
  };

  const Icon = icons[type];
  const colorSet = colors[type];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      size="sm">
      
      <div className="text-center">
        <div className={`w-14 h-14 rounded-3xl ${colorSet.icon} flex items-center justify-center mx-auto mb-4 border border-zinc-800`}>
          <Icon className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-sm text-zinc-500 mb-6">{message}</p>
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-zinc-400 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition-colors">
            
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 px-4 py-2.5 text-sm font-medium text-white rounded-xl transition-colors shadow-lg ${colorSet.button}`}>
            
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>);

}