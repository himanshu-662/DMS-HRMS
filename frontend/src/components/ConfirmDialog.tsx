import { AlertTriangle, Trash2, CheckCircle2 } from 'lucide-react';
import Modal from './Modal';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type?: 'danger' | 'warning' | 'success';
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'danger',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}: ConfirmDialogProps) {
  const icons = {
    danger: Trash2,
    warning: AlertTriangle,
    success: CheckCircle2,
  };

  const colors = {
    danger: {
      icon: 'bg-red-100 text-red-600',
      button: 'bg-red-600 hover:bg-red-700 shadow-red-600/25',
    },
    warning: {
      icon: 'bg-amber-100 text-amber-600',
      button: 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/25',
    },
    success: {
      icon: 'bg-emerald-100 text-emerald-600',
      button: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25',
    },
  };

  const Icon = icons[type];
  const colorSet = colors[type];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      size="sm"
    >
      <div className="text-center">
        <div className={`w-14 h-14 rounded-2xl ${colorSet.icon} flex items-center justify-center mx-auto mb-4`}>
          <Icon className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-6">{message}</p>
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 px-4 py-2.5 text-sm font-medium text-white rounded-xl transition-colors shadow-lg ${colorSet.button}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
