import { useState, useEffect } from 'react';
import { 
  Activity, Shield, Server, Database, 
  Cpu, HardDrive, Zap, AlertCircle, 
  CheckCircle2, RefreshCw, BarChart3, Clock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/FormInput';
import { cn } from '../utils/cn';

export default function SystemHealth() {
  const { state, showToast, api } = useApp();
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHealth = async () => {
    setRefreshing(true);
    try {
      const response = await api.get('/api/super-admin/system/health');
      setHealthData(response.data);
    } catch (err) {
      showToast('error', 'Failed to fetch system health');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 30000); // Auto-refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const services = [
    { name: 'Core API Server', status: 'healthy', latency: '12ms', uptime: '99.99%', icon: Server },
    { name: 'Primary Database', status: 'healthy', latency: '5ms', uptime: '99.99%', icon: Database },
    { name: 'Storage Service', status: 'healthy', latency: '45ms', uptime: '99.95%', icon: HardDrive },
    { name: 'Authentication Provider', status: 'healthy', latency: '8ms', uptime: '100%', icon: Shield },
    { name: 'Background Workers', status: 'healthy', latency: 'N/A', uptime: '99.90%', icon: Zap },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">System Health & Monitoring</h1>
          <p className="text-sm text-zinc-500 mt-1">Real-time status of platform services, infrastructure, and security protocols.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-xs font-bold px-4"
            icon={<RefreshCw className={cn("w-4 h-4", refreshing && "animate-spin")} />}
            onClick={fetchHealth}
            disabled={refreshing}>
            Refresh Status
          </Button>
          <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Global Systems Operational</span>
          </div>
        </div>
      </div>

      {/* Resource Usage */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Cpu className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded uppercase">Normal</span>
          </div>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">CPU Load</p>
          <p className="text-2xl font-bold text-white">24.5%</p>
          <div className="mt-4 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 w-[24.5%]" />
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-500">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-violet-500 bg-violet-500/10 px-2 py-0.5 rounded uppercase">Optimized</span>
          </div>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Memory Usage</p>
          <p className="text-2xl font-bold text-white">5.8 GB <span className="text-xs text-zinc-500 font-normal">/ 16 GB</span></p>
          <div className="mt-4 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-violet-500 w-[36%]" />
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded uppercase">Stable</span>
          </div>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Response Time</p>
          <p className="text-2xl font-bold text-white">124ms <span className="text-xs text-zinc-500 font-normal">avg</span></p>
          <div className="mt-4 flex items-center gap-1">
            {[4, 6, 5, 8, 7, 4, 3, 5, 6, 8].map((h, i) => (
              <div key={i} style={{ height: `${h * 4}px` }} className="flex-1 bg-emerald-500/30 rounded-t-sm" />
            ))}
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <Shield className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded uppercase">Active</span>
          </div>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Threat Detection</p>
          <p className="text-2xl font-bold text-white">0 <span className="text-xs text-zinc-500 font-normal text-emerald-500">Critical</span></p>
          <p className="mt-4 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Last scan: 2 mins ago</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Service Status */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-zinc-800 flex items-center justify-between">
            <h3 className="text-xl font-bold text-white tracking-tight">Core Services Status</h3>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Last check: Just now</span>
          </div>
          <div className="p-8 space-y-4">
            {services.map((service, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-zinc-950/50 rounded-2xl border border-zinc-800/50 hover:border-zinc-700 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
                    <service.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{service.name}</h4>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-[10px] text-zinc-500 font-medium">Uptime: {service.uptime}</span>
                      <span className="text-[10px] text-zinc-500 font-medium">Latency: {service.latency}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black uppercase text-emerald-500 tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    Healthy
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Logs */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-white tracking-tight">Security Events</h3>
            <button className="text-[10px] font-bold text-primary-500 uppercase tracking-widest hover:underline">View All</button>
          </div>
          <div className="space-y-6">
            {[
              { type: 'info', msg: 'Successful daily database backup', time: '12:00 PM', icon: Database },
              { type: 'warning', msg: 'Failed login attempt from IP 192.168.1.1', time: '11:45 AM', icon: Shield },
              { type: 'info', msg: 'New organization onboarded: TechFlow', time: '10:30 AM', icon: CheckCircle2 },
              { type: 'info', msg: 'System update v2.4.0 deployed successfully', time: '09:00 AM', icon: Zap },
              { type: 'info', msg: 'Weekly security audit completed', time: 'Yesterday', icon: Shield },
            ].map((log, i) => (
              <div key={i} className="flex gap-4 group">
                <div className={cn(
                  "w-8 h-8 shrink-0 rounded-lg flex items-center justify-center",
                  log.type === 'warning' ? 'bg-amber-500/10 text-amber-500' : 'bg-zinc-800 text-zinc-400'
                )}>
                  <log.icon className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-white group-hover:text-primary-400 transition-colors">{log.msg}</p>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium">{log.time}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 p-6 bg-zinc-950 rounded-3xl border border-zinc-800">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-4 h-4 text-primary-500" />
              <h4 className="text-xs font-bold text-white uppercase tracking-widest">Platform Note</h4>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Platform stability is at 100% for the last 24 hours. No manual interventions required.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
