import { cn } from '../utils/cn';
















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
  max
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-zinc-400 ml-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative group">
        {icon &&
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-primary-500 transition-colors">
            {icon}
          </div>
        }
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          max={max}
          className={cn(
            'w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:border-primary-500 transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-zinc-700',
            icon && 'pl-11',
            error && 'border-red-500/50 focus:border-red-500'
          )} />
      </div>
      {error && <p className="text-[10px] text-red-500 font-medium ml-1">{error}</p>}
    </div>);
}

export function FormSelect({
  label,
  value,
  onChange,
  options,
  required,
  error,
  disabled
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-zinc-500 ml-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={cn(
            'w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:border-primary-500 transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed appearance-none cursor-pointer',
            error && 'border-red-500/50 focus:border-red-500'
          )}>
          {options.map((opt) =>
          <option key={opt.value} value={opt.value} className="bg-zinc-900">
              {opt.label}
            </option>
          )}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && <p className="text-[10px] text-red-500 font-medium ml-1">{error}</p>}
    </div>);
}

export function FormCheckbox({
  label,
  checked,
  onChange,
  disabled,
  description
}) {
  return (
    <div className="flex items-start gap-3 p-3 bg-zinc-950 border border-zinc-800 rounded-xl transition-all hover:bg-zinc-900/50 group cursor-pointer" onClick={() => !disabled && onChange(!checked)}>
      <div className="flex items-center h-5">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => {
            e.stopPropagation();
            onChange(e.target.checked);
          }}
          disabled={disabled}
          className="w-4 h-4 text-primary-600 border-zinc-700 rounded focus:ring-primary-500 bg-zinc-900 transition-all cursor-pointer" />
      </div>
      <div className="text-xs">
        <label className="font-bold text-zinc-200 cursor-pointer">{label}</label>
        {description && <p className="text-zinc-500 text-[10px] mt-0.5 leading-relaxed">{description}</p>}
      </div>
    </div>);
}

export function FormTextarea({
  label,
  value,
  onChange,
  placeholder,
  required,
  error,
  rows = 3
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-zinc-500 ml-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={cn(
          'w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:border-primary-500 transition-all outline-none resize-none placeholder:text-zinc-700',
          error && 'border-red-500/50 focus:border-red-500'
        )} />
      {error && <p className="text-[10px] text-red-500 font-medium ml-1">{error}</p>}
    </div>);
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
  fullWidth
}) {
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-500 shadow-lg shadow-primary-900/20',
    secondary: 'bg-zinc-800 text-white border border-zinc-700 hover:bg-zinc-700',
    danger: 'bg-red-600 text-white hover:bg-red-500',
    ghost: 'text-zinc-400 hover:text-white hover:bg-zinc-800'
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        'font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full'
      )}>
      {loading ?
      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> :
      icon
      }
      {children}
    </button>);
}