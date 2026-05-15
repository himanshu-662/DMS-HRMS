import { useState, useMemo } from 'react';
import {
  DollarSign, Download, CheckCircle2, Clock,
  TrendingUp, Eye, Play } from
'lucide-react';
import { useApp } from '../context/AppContext';
import StatCard from '../components/StatCard';
import { cn } from '../utils/cn';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { Button } from '../components/FormInput';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function Payroll() {
  const { state, dispatch, showToast } = useApp();
  const { payroll = [] } = state;

  const [selectedMonth, setSelectedMonth] = useState('November 2024');
  const [showPayslip, setShowPayslip] = useState(null);
  const [showProcessConfirm, setShowProcessConfirm] = useState(false);

  const stats = useMemo(() => ({
    totalPayroll: payroll.reduce((sum, p) => sum + p.netSalary, 0),
    processed: payroll.filter((p) => p.status === 'processed').length,
    pending: payroll.filter((p) => p.status === 'pending').length,
    totalDeductions: payroll.reduce((sum, p) => sum + p.deductions + p.pf + p.tax, 0)
  }), [payroll]);

  const payrollBreakdown = useMemo(() => [
    { name: 'Basic', value: payroll.reduce((s, p) => s + p.basicSalary, 0), color: '#3b82f6' },
    { name: 'HRA', value: payroll.reduce((s, p) => s + p.hra, 0), color: '#10b981' },
    { name: 'Allowances', value: payroll.reduce((s, p) => s + p.allowances, 0), color: '#f59e0b' },
    { name: 'Deductions', value: stats.totalDeductions, color: '#ef4444' }
  ], [payroll, stats.totalDeductions]);

  const selectedPayslip = showPayslip ? payroll.find((p) => p.id === showPayslip) : null;

  const handleProcessPayroll = (id) => {
    dispatch({ type: 'PROCESS_PAYROLL', payload: id });
    const record = payroll.find((p) => p.id === id);
    showToast('success', 'Payroll Processed', `${record?.employeeName}'s payroll has been processed for ${selectedMonth}.`, 'update');
  };

  const handleProcessAll = () => {
    dispatch({ type: 'PROCESS_ALL_PAYROLL' });
    showToast('success', 'All Payroll Processed', `${stats.pending} records have been processed.`);
    setShowProcessConfirm(false);
  };

  const exportPayroll = () => {
    const headers = ['Employee', 'Basic', 'HRA', 'Allowances', 'Deductions', 'PF', 'Tax', 'Net Salary', 'Status'];
    const rows = payroll.map((p) => [
      p.employeeName, p.basicSalary, p.hra, p.allowances, p.deductions, p.pf, p.tax, p.netSalary, p.status
    ]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payroll-${selectedMonth.replace(' ', '-')}.csv`;
    a.click();
    showToast('success', 'Export Complete', 'Payroll data has been exported.');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Payroll</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage employee salaries, deductions, and tax compliance.</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="h-11 px-4 bg-zinc-900 rounded-xl text-sm font-bold border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-white transition-all">
            <option>November 2024</option>
            <option>October 2024</option>
            <option>September 2024</option>
          </select>
          <Button variant="ghost" className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-xs font-bold px-4 h-11" icon={<Download className="w-4 h-4" />} onClick={exportPayroll}>Export CSV</Button>
          <Button className="bg-primary-600 hover:bg-primary-500 text-xs font-bold px-6 h-11 shadow-lg shadow-primary-900/20" icon={<Play className="w-4 h-4" />} onClick={() => setShowProcessConfirm(true)}>Process All</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Payroll', value: `$${(stats.totalPayroll / 1000).toFixed(1)}K`, icon: DollarSign, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
          { label: 'Processed', value: stats.processed, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
          { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
          { label: 'Deductions', value: `$${(stats.totalDeductions / 1000).toFixed(1)}K`, icon: TrendingUp, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' }
        ].map((stat) => (
          <div key={stat.label} className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 flex flex-col">
            <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.border} border flex items-center justify-center mb-4`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold text-white tracking-tight">{stat.value}</p>
            <p className="text-xs font-medium text-zinc-500 mt-1 uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Salary Breakdown Chart */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8">
          <h3 className="text-sm font-bold text-white mb-8">Salary Breakdown</h3>
          
          <div className="h-[240px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={payrollBreakdown} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={65} 
                  outerRadius={90} 
                  paddingAngle={5} 
                  dataKey="value"
                  stroke="none"
                >
                  {payrollBreakdown.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderRadius: '0.75rem', border: '1px solid #27272a', padding: '0.75rem' }} 
                  itemStyle={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
                  formatter={(v) => `$${Number(v).toLocaleString()}`} 
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total Gross</p>
              <p className="text-xl font-bold text-white">${((stats.totalPayroll + stats.totalDeductions) / 1000).toFixed(1)}K</p>
            </div>
          </div>

          <div className="space-y-4 mt-8">
            {payrollBreakdown.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-medium text-zinc-400">{item.name}</span>
                </div>
                <span className="text-xs font-bold text-white">${item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payroll Table */}
        <div className="lg:col-span-2 bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800">
            <h3 className="text-sm font-bold text-white">Payroll Records</h3>
            <span className="text-[10px] font-bold text-zinc-500 bg-zinc-950 px-2.5 py-1 rounded-lg border border-zinc-800 uppercase">{payroll.length} Employees</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-zinc-950/50 border-b border-zinc-800">
                  <th className="text-left px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Employee</th>
                  <th className="text-right px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-wider hidden md:table-cell">Basic Salary</th>
                  <th className="text-right px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-wider hidden lg:table-cell">Deductions</th>
                  <th className="text-right px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Net Payable</th>
                  <th className="text-center px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Status</th>
                  <th className="text-right px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {payroll.map((record) => (
                  <tr key={record.id} className="hover:bg-zinc-800/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary-600/20 text-primary-400 flex items-center justify-center text-[10px] font-bold">
                          {record.employeeName.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <span className="text-sm font-medium text-white">{record.employeeName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-xs font-medium text-zinc-400 hidden md:table-cell">${record.basicSalary.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right text-xs font-medium text-rose-500/80 hidden lg:table-cell">-${(record.deductions + record.pf + record.tax).toLocaleString()}</td>
                    <td className="px-6 py-4 text-right text-sm font-bold text-white">${record.netSalary.toLocaleString()}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={cn(
                        'text-[10px] font-bold px-2.5 py-1 rounded-md border',
                        record.status === 'processed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                      )}>
                        {record.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setShowPayslip(record.id)} className="p-2 text-zinc-500 hover:text-white transition-colors"><Eye className="w-4 h-4" /></button>
                        {record.status === 'pending' && (
                          <button onClick={() => handleProcessPayroll(record.id)} className="p-2 text-emerald-500 hover:text-emerald-400 transition-colors"><Play className="w-4 h-4" /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Payslip Modal */}
      <Modal
        isOpen={!!selectedPayslip}
        onClose={() => setShowPayslip(null)}
        title="Payslip Details"
        subtitle={`Salary Statement · ${selectedPayslip?.month}`}
        size="lg"
        footer={
          <>
            <Button variant="ghost" className="px-6 text-xs font-bold" icon={<Download className="w-4 h-4" />}>Download PDF</Button>
            <Button className="bg-zinc-800 px-6 text-xs font-bold" onClick={() => setShowPayslip(null)}>Close</Button>
          </>
        }>
        
        {selectedPayslip && (
          <div className="space-y-8 py-2">
            <div className="flex items-center gap-5 p-6 bg-zinc-950 rounded-2xl border border-zinc-800">
              <div className="w-14 h-14 rounded-xl bg-primary-600 flex items-center justify-center text-white text-lg font-bold shadow-lg">
                {selectedPayslip.employeeName.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <p className="text-xl font-bold text-white">{selectedPayslip.employeeName}</p>
                <p className="text-xs text-zinc-500 mt-1 font-medium">Employee ID: {selectedPayslip.employeeId}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest px-1">Earnings</h4>
                <div className="space-y-3 p-5 bg-zinc-950 rounded-2xl border border-zinc-800">
                  {[
                    { label: 'Basic Salary', value: selectedPayslip.basicSalary },
                    { label: 'HRA', value: selectedPayslip.hra },
                    { label: 'Allowances', value: selectedPayslip.allowances }
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-center">
                      <span className="text-xs text-zinc-400 font-medium">{item.label}</span>
                      <span className="text-xs font-bold text-white">${item.value.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="pt-3 border-t border-zinc-800 flex justify-between items-center">
                    <span className="text-xs font-bold text-white">Gross Total</span>
                    <span className="text-xs font-bold text-emerald-500">${(selectedPayslip.basicSalary + selectedPayslip.hra + selectedPayslip.allowances).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest px-1">Deductions</h4>
                <div className="space-y-3 p-5 bg-zinc-950 rounded-2xl border border-zinc-800">
                  {[
                    { label: 'Salary Deductions', value: selectedPayslip.deductions },
                    { label: 'PF Contribution', value: selectedPayslip.pf },
                    { label: 'Tax', value: selectedPayslip.tax }
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-center">
                      <span className="text-xs text-zinc-400 font-medium">{item.label}</span>
                      <span className="text-xs font-bold text-rose-500">-${item.value.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="pt-3 border-t border-zinc-800 flex justify-between items-center">
                    <span className="text-xs font-bold text-white">Total Deductions</span>
                    <span className="text-xs font-bold text-rose-500">-${(selectedPayslip.deductions + selectedPayslip.pf + selectedPayslip.tax).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-primary-600/10 border border-primary-500/20 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <p className="text-[10px] font-bold text-primary-500 uppercase tracking-widest mb-1">Net Salary Payable</p>
                <p className="text-4xl font-bold text-white tracking-tight">${selectedPayslip.netSalary.toLocaleString()}</p>
              </div>
              <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                Payment Authorized
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={showProcessConfirm}
        onClose={() => setShowProcessConfirm(false)}
        onConfirm={handleProcessAll}
        title="Process All Payroll"
        message={`This will process payroll for ${stats.pending} pending employee records. This action cannot be undone.`}
        type="success"
        confirmText="Process Payroll" />
    </div>
  );
}


