import { useState, useEffect, useMemo } from 'react';
import { 
  Building, Users, DollarSign, Activity, TrendingUp, 
  Globe, Shield, AlertCircle, ArrowUpRight, ArrowDownRight,
  Monitor, Database, Server, Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import StatCard from '../components/StatCard';
import { cn } from '../utils/cn';

const GlobalStats = [
  { title: 'Total Organizations', value: '124', icon: Building, trend: '+12%', color: 'blue' },
  { title: 'Total Employees', value: '8,432', icon: Users, trend: '+18%', color: 'emerald' },
  { title: 'Monthly Revenue', value: '$42,500', icon: DollarSign, trend: '+24%', color: 'violet' },
  { title: 'System Health', value: '99.9%', icon: Activity, trend: 'Optimal', color: 'cyan' },
];

export default function SuperAdminDashboard() {
  const { state, showToast, api } = useApp();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/api/super-admin/dashboard');
        setStats(response.data);
      } catch (err) {
        showToast('error', 'Failed to fetch global stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Platform Control Center</h1>
          <p className="text-sm text-zinc-500 mt-1">Global oversight and SaaS platform analytics across all organizations.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">System Online</span>
          </div>
        </div>
      </div>

      {/* Global Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Organizations" value={stats?.total_organizations || '0'} icon={Building} trend="+5 this week" color="blue" />
        <StatCard title="Total Employees" value={stats?.total_employees || '0'} icon={Users} trend="+124 new" color="emerald" />
        <StatCard title="Monthly Revenue" value={`$${stats?.monthly_revenue?.toLocaleString() || '0'}`} icon={DollarSign} trend="+15% vs last month" color="violet" />
        <StatCard title="Active Users" value={stats?.active_users || '0'} icon={Activity} trend="99.9% uptime" color="cyan" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* System Monitoring */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-white tracking-tight">Platform Usage Trends</h3>
              <select className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-xs font-bold text-white focus:outline-none">
                <option>Last 30 Days</option>
                <option>Last 6 Months</option>
                <option>Year to Date</option>
              </select>
            </div>
            
            {/* Chart Placeholder */}
            <div className="h-[300px] flex items-end justify-between gap-2 px-4">
              {[45, 62, 55, 80, 75, 90, 85, 100, 95, 110, 105, 120].map((h, i) => (
                <div key={i} className="flex-1 group relative">
                  <div 
                    style={{ height: `${h}%` }}
                    className="bg-primary-500/20 group-hover:bg-primary-500 transition-all rounded-t-lg relative"
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-800 text-white text-[10px] font-bold px-2 py-1 rounded">
                      {h*10}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 px-4">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                <span key={m} className="text-[10px] font-bold text-zinc-600">{m}</span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 hover:border-zinc-700 transition-all group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <Server className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Server Health</h4>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">Global Cluster</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-[10px] font-bold text-zinc-400 uppercase mb-2">
                    <span>CPU Usage</span>
                    <span>24%</span>
                  </div>
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[24%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-bold text-zinc-400 uppercase mb-2">
                    <span>Memory</span>
                    <span>58%</span>
                  </div>
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 w-[58%]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 hover:border-zinc-700 transition-all group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Database Cluster</h4>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">Primary - Region 1</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-zinc-950 rounded-xl border border-zinc-800">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase">Latency</span>
                  <span className="text-xs font-bold text-emerald-500">12ms</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-zinc-950 rounded-xl border border-zinc-800">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase">Conn. Pool</span>
                  <span className="text-xs font-bold text-white">124/500</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-6 shadow-xl">
            <h4 className="text-sm font-bold text-white mb-6 tracking-tight">Recent Onboarding</h4>
            <div className="space-y-4">
              {[
                { name: 'TechFlow Systems', time: '2h ago', status: 'Enterprise' },
                { name: 'Urban Green Co.', time: '5h ago', status: 'Business' },
                { name: 'Creative Minds', time: 'Yesterday', status: 'Basic' },
                { name: 'Nexus Solutions', time: '2 days ago', status: 'Enterprise' },
              ].map((org, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-zinc-950/50 rounded-2xl border border-transparent hover:border-zinc-800 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-500 font-bold text-[10px]">
                      {org.name[0]}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{org.name}</p>
                      <p className="text-[9px] text-zinc-500 mt-0.5">{org.time}</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-black uppercase text-primary-500 tracking-tighter bg-primary-500/10 px-2 py-1 rounded">
                    {org.status}
                  </span>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 bg-zinc-800 hover:bg-zinc-750 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all">
              View All Organizations
            </button>
          </div>

          <div className="bg-primary-600 rounded-[2rem] p-6 shadow-xl relative overflow-hidden group">
            <div className="relative z-10">
              <Shield className="w-8 h-8 text-white mb-4" />
              <h4 className="text-lg font-bold text-white leading-tight mb-2">Security Center</h4>
              <p className="text-xs text-primary-100 font-medium mb-6">Monitor global platform security and manage role permissions.</p>
              <button className="px-4 py-2 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg hover:scale-105 transition-all">
                Security Audit
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700" />
          </div>
        </div>
      </div>
    </div>
  );
}
