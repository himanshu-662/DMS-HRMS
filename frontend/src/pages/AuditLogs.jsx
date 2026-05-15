import { useState, useEffect } from 'react';
import { 
  Shield, ShieldCheck, History, Search, 
  Filter, Download, AlertTriangle, User,
  Globe, Clock, Terminal, ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../utils/cn';

export default function AuditLogs() {
  const { state, api } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const logs = [
    { id: 1, user: 'superadmin@dms.com', action: 'Update Organization Status', target: 'TechFlow Systems', timestamp: '2024-11-15 14:30:22', ip: '192.168.1.1', severity: 'medium' },
    { id: 2, user: 'superadmin@dms.com', action: 'Create New Organization', target: 'Urban Green Co.', timestamp: '2024-11-15 12:15:45', ip: '192.168.1.1', severity: 'high' },
    { id: 3, user: 'hr@dms.com', action: 'Update Payroll', target: 'DMS Solutions', timestamp: '2024-11-15 10:05:12', ip: '10.0.0.5', severity: 'low' },
    { id: 4, user: 'superadmin@dms.com', action: 'Delete Employee', target: 'Nexus Solutions', timestamp: '2024-11-14 16:45:30', ip: '192.168.1.1', severity: 'critical' },
    { id: 5, user: 'admin@techcorp.com', action: 'Login Success', target: 'Tech Corp', timestamp: '2024-11-14 09:00:01', ip: '172.16.0.42', severity: 'low' },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Platform Audit Logs</h1>
          <p className="text-sm text-zinc-500 mt-1">Immutable record of all administrative actions and security-sensitive operations.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold text-white hover:bg-zinc-800 transition-all flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Logs
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-primary-500 transition-colors" />
          <input
            type="text"
            placeholder="Search logs by user, action, or target..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-zinc-900 rounded-xl text-sm font-medium border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/50 transition-all text-white" />
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold text-white hover:bg-zinc-800 transition-all flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filters
          </button>
          <button className="px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold text-white hover:bg-zinc-800 transition-all flex items-center gap-2">
            <History className="w-4 h-4" /> Live View
          </button>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-zinc-900 rounded-[2.5rem] border border-zinc-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-zinc-950 border-b border-zinc-800">
                <th className="text-left px-8 py-5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Severity</th>
                <th className="text-left px-8 py-5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">User / Administrator</th>
                <th className="text-left px-8 py-5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Action Performed</th>
                <th className="text-left px-8 py-5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Target Entity</th>
                <th className="text-left px-8 py-5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Timestamp</th>
                <th className="text-right px-8 py-5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Context</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-zinc-800/30 transition-all group">
                  <td className="px-8 py-5">
                    <span className={cn(
                      "text-[9px] font-black uppercase tracking-tighter px-2 py-1 rounded border",
                      log.severity === 'critical' ? 'text-rose-500 bg-rose-500/10 border-rose-500/20' :
                      log.severity === 'high' ? 'text-amber-500 bg-amber-500/10 border-amber-500/20' :
                      log.severity === 'medium' ? 'text-blue-500 bg-blue-500/10 border-blue-500/20' :
                      'text-zinc-500 bg-zinc-500/10 border-zinc-500/20'
                    )}>
                      {log.severity}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-500">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-white">{log.user}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-xs font-medium text-zinc-300">{log.action}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-zinc-500" />
                      <span className="text-xs font-bold text-primary-400">{log.target}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-zinc-500" />
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{log.timestamp}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <code className="text-[10px] font-bold text-zinc-600 bg-zinc-950 px-2 py-1 rounded border border-zinc-800">
                      {log.ip}
                    </code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-8 bg-zinc-950/50 border-t border-zinc-800 flex items-center justify-between">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Showing 5 of 12,432 entries</p>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-[10px] font-bold text-white opacity-50 cursor-not-allowed">Previous</button>
            <button className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-[10px] font-bold text-white hover:bg-zinc-800">Next Page</button>
          </div>
        </div>
      </div>
    </div>
  );
}
