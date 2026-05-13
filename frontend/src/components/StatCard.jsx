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
    <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 shadow-xl group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-zinc-500">{title}</p>
          <p className="text-3xl font-bold text-white mt-2 tracking-tight">{value}</p>
          {change !== undefined &&
          <div className="flex items-center gap-1.5 mt-3">
              {change >= 0 ?
            <TrendingUp className="w-4 h-4 text-emerald-500" /> :
            <TrendingDown className="w-4 h-4 text-rose-500" />
            }
              <span className={cn('text-xs font-bold', change >= 0 ? 'text-emerald-500' : 'text-rose-500')}>
                {change >= 0 ? '+' : ''}{change}%
              </span>
              <span className="text-[10px] font-medium text-zinc-600">vs last month</span>
            </div>
          }
          {subtitle &&
          <p className="text-[10px] font-medium text-zinc-500 mt-2">{subtitle}</p>
          }
        </div>
        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', colors.bg)}>
          <Icon className={cn('w-6 h-6', colors.icon)} />
        </div>
      </div>
    </div>);

}