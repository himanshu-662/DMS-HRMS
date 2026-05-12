import { cn } from '../utils/cn';
import { ReactNode } from 'react';

interface FormInputProps {
  label: string;
  type?: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  icon?: ReactNode;
  min?: string | number;
  max?: string | number;
}

export function FormInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required,
  error,
  disabled,
  icon,
  min,
  max,
}: FormInputProps) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1 block">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          max={max}
          className={cn(
            'w-full px-3 py-2.5 bg-gray-50 rounded-xl text-sm border-0 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed',
            icon && 'pl-10',
            error && 'ring-2 ring-red-500/30 bg-red-50'
          )}
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

interface FormSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  error?: string;
  disabled?: boolean;
}

export function FormSelect({
  label,
  value,
  onChange,
  options,
  required,
  error,
  disabled,
}: FormSelectProps) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1 block">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={cn(
          'w-full px-3 py-2.5 bg-gray-50 rounded-xl text-sm border-0 focus:outline-none focus:ring-2 focus:ring-primary-500/30 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
          error && 'ring-2 ring-red-500/30 bg-red-50'
        )}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

interface FormTextareaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  rows?: number;
}

export function FormTextarea({
  label,
  value,
  onChange,
  placeholder,
  required,
  error,
  rows = 3,
}: FormTextareaProps) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1 block">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={cn(
          'w-full px-3 py-2.5 bg-gray-50 rounded-xl text-sm border-0 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:bg-white transition-all resize-none',
          error && 'ring-2 ring-red-500/30 bg-red-50'
        )}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
}

export function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled,
  loading,
  icon,
  fullWidth,
}: ButtonProps) {
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-600/25',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/25',
    ghost: 'text-gray-600 hover:bg-gray-100',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        'font-medium rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full'
      )}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon
      )}
      {children}
    </button>
  );
}
