import { cn } from '../utils/cn';
import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'cyan';
  subtitle?: string;
}

const colorMap = {
  blue: { bg: 'bg-blue-50', icon: 'bg-blue-500', text: 'text-blue-600' },
  green: { bg: 'bg-emerald-50', icon: 'bg-emerald-500', text: 'text-emerald-600' },
  orange: { bg: 'bg-orange-50', icon: 'bg-orange-500', text: 'text-orange-600' },
  purple: { bg: 'bg-violet-50', icon: 'bg-violet-500', text: 'text-violet-600' },
  red: { bg: 'bg-rose-50', icon: 'bg-rose-500', text: 'text-rose-600' },
  cyan: { bg: 'bg-cyan-50', icon: 'bg-cyan-500', text: 'text-cyan-600' },
};

export default function StatCard({ title, value, change, icon: Icon, color, subtitle }: StatCardProps) {
  const colors = colorMap[color];

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg hover:shadow-gray-100/50 transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {change >= 0 ? (
                <TrendingUp className="w-3.5 h-3.5 text-success-500" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-danger-500" />
              )}
              <span className={cn('text-xs font-semibold', change >= 0 ? 'text-success-600' : 'text-danger-600')}>
                {change >= 0 ? '+' : ''}{change}%
              </span>
              <span className="text-xs text-gray-400">vs last month</span>
            </div>
          )}
          {subtitle && (
            <p className="text-xs text-gray-400 mt-1.5">{subtitle}</p>
          )}
        </div>
        <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform', colors.bg)}>
          <Icon className={cn('w-6 h-6', colors.text)} />
        </div>
      </div>
    </div>
  );
}
