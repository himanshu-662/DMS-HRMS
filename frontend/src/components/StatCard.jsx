import { cn } from '../utils/cn';
import { TrendingUp, TrendingDown } from 'lucide-react';

const colorMap = {
  blue: { bg: 'bg-blue-500/10', icon: 'text-blue-500' },
  indigo: { bg: 'bg-indigo-500/10', icon: 'text-indigo-500' },
  green: { bg: 'bg-emerald-500/10', icon: 'text-emerald-500' },
  emerald: { bg: 'bg-emerald-500/10', icon: 'text-emerald-500' },
  orange: { bg: 'bg-orange-500/10', icon: 'text-orange-500' },
  purple: { bg: 'bg-violet-500/10', icon: 'text-violet-500' },
  red: { bg: 'bg-rose-500/10', icon: 'text-rose-500' },
  cyan: { bg: 'bg-cyan-500/10', icon: 'text-cyan-500' },
  zinc: { bg: 'bg-zinc-500/10', icon: 'text-zinc-500' }
};

export default function StatCard({ title, value, change, icon: Icon, color = 'blue', subtitle, trend }) {
  const colors = colorMap[color] || colorMap.blue;

  return (
    <div className="glass-executive luminous-stroke p-6 group transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-black text-zinc-500 uppercase tracking-widest">{title}</p>
          <p className="text-3xl font-black text-white mt-3 tracking-tighter">{value}</p>
          {change !== undefined && (
            <div className="flex items-center gap-1.5 mt-4">
              <div className={cn(
                "flex items-center gap-1 px-2 py-0.5 rounded-full text-sm font-black uppercase tracking-tight",
                change >= 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
              )}>
                {change >= 0 ? <TrendingUp className="w-4 h-4" strokeWidth={2.5} /> : <TrendingDown className="w-4 h-4" strokeWidth={2.5} />}
                {change >= 0 ? '+' : ''}{change}%
              </div>
              <span className="text-sm font-bold text-zinc-600 uppercase tracking-widest">vs last month</span>
            </div>
          )}
          {subtitle && (
            <p className="text-sm font-bold text-zinc-500 mt-3 uppercase tracking-wide opacity-60">{subtitle}</p>
          )}
        </div>
        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500', colors.bg)}>
          <Icon className={cn('w-6 h-6', colors.icon)} strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
}