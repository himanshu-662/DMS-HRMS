import { useState, useEffect } from 'react';
import { 
  BarChart3, TrendingUp, DollarSign, Users, 
  Building, Globe, Download, Calendar, 
  ArrowUpRight, ArrowDownRight, Filter
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { useApp } from '../context/AppContext';
import { cn } from '../utils/cn';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

export default function PlatformAnalytics() {
  const { state, api } = useApp();
  const [loading, setLoading] = useState(true);

  // Mock data for platform-wide analytics
  const revenueData = [
    { month: 'Jan', revenue: 12000, orgs: 85 },
    { month: 'Feb', revenue: 15000, orgs: 92 },
    { month: 'Mar', revenue: 18500, orgs: 105 },
    { month: 'Apr', revenue: 22000, orgs: 118 },
    { month: 'May', revenue: 28000, orgs: 134 },
    { month: 'Jun', revenue: 35000, orgs: 156 },
  ];

  const orgDistribution = [
    { name: 'Enterprise', value: 24 },
    { name: 'Business', value: 45 },
    { name: 'Basic', value: 87 },
  ];

  const regionData = [
    { region: 'North America', users: 4500 },
    { region: 'Europe', users: 3200 },
    { region: 'Asia Pacific', users: 2800 },
    { region: 'LATAM', users: 1200 },
    { region: 'MEA', users: 800 },
  ];

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Platform-Wide Analytics</h1>
          <p className="text-sm text-zinc-500 mt-1">Global business intelligence and usage trends across the entire HRMS network.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold text-white hover:bg-zinc-800 transition-all flex items-center gap-2">
            <Calendar className="w-4 h-4 text-zinc-500" />
            Last 6 Months
          </button>
          <button className="px-4 py-2 bg-primary-600 border border-primary-500 rounded-xl text-xs font-bold text-white hover:bg-primary-500 shadow-lg shadow-primary-900/20 transition-all flex items-center gap-2">
            <Download className="w-4 h-4" />
            Generate Report
          </button>
        </div>
      </div>

      {/* High-level metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2rem] shadow-xl relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Total MRR</p>
            <h3 className="text-4xl font-bold text-white tracking-tight">$42,500</h3>
            <div className="mt-4 flex items-center gap-2 text-emerald-500">
              <ArrowUpRight className="w-4 h-4" />
              <span className="text-xs font-bold">+24% from last month</span>
            </div>
          </div>
          <DollarSign className="absolute -right-4 -bottom-4 w-32 h-32 text-zinc-800/50 group-hover:text-primary-500/10 transition-colors" />
        </div>
        
        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2rem] shadow-xl relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Active Organizations</p>
            <h3 className="text-4xl font-bold text-white tracking-tight">156</h3>
            <div className="mt-4 flex items-center gap-2 text-emerald-500">
              <ArrowUpRight className="w-4 h-4" />
              <span className="text-xs font-bold">+12 new this week</span>
            </div>
          </div>
          <Building className="absolute -right-4 -bottom-4 w-32 h-32 text-zinc-800/50 group-hover:text-violet-500/10 transition-colors" />
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2rem] shadow-xl relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Global End Users</p>
            <h3 className="text-4xl font-bold text-white tracking-tight">12,432</h3>
            <div className="mt-4 flex items-center gap-2 text-emerald-500">
              <ArrowUpRight className="w-4 h-4" />
              <span className="text-xs font-bold">+842 this month</span>
            </div>
          </div>
          <Users className="absolute -right-4 -bottom-4 w-32 h-32 text-zinc-800/50 group-hover:text-emerald-500/10 transition-colors" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Growth */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Revenue & Org Growth</h3>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Global SaaS Performance</p>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-primary-500/10 rounded-lg">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                <span className="text-[9px] font-black uppercase text-primary-500">Revenue</span>
              </div>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#71717a', fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#71717a', fontWeight: 600 }} tickFormatter={(v) => `$${v/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', borderRadius: '1rem', border: '1px solid #27272a' }}
                  itemStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Plan Distribution */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 shadow-xl">
          <h3 className="text-lg font-bold text-white tracking-tight mb-8 text-center">Subscription Distribution</h3>
          <div className="flex flex-col md:flex-row items-center justify-center gap-10">
            <div className="w-full md:w-1/2 h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={orgDistribution} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={8} dataKey="value">
                    {orgDistribution.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#09090b', borderRadius: '1rem', border: '1px solid #27272a' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/2 space-y-4">
              {orgDistribution.map((item, i) => (
                <div key={item.name} className="flex items-center justify-between p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{item.name}</span>
                  </div>
                  <span className="text-sm font-black text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Regional Usage Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/50">
          <h3 className="text-lg font-bold text-white tracking-tight">Regional User Adoption</h3>
          <button className="text-[10px] font-bold text-primary-500 uppercase tracking-widest flex items-center gap-2">
            <Filter className="w-3 h-3" /> Filter by Region
          </button>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {regionData.map((data, i) => (
              <div key={i} className="p-6 bg-zinc-950 rounded-3xl border border-zinc-800 hover:border-zinc-700 transition-all group">
                <Globe className="w-5 h-5 text-zinc-500 mb-4 group-hover:text-primary-500 transition-colors" />
                <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">{data.region}</p>
                <p className="text-xl font-bold text-white">{data.users.toLocaleString()}</p>
                <div className="mt-4 h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary-500" 
                    style={{ width: `${(data.users / 4500) * 100}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
