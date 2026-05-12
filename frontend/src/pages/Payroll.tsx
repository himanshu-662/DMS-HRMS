import { useState, useMemo } from 'react';
import {
  DollarSign, Download, CheckCircle2, Clock,
  TrendingUp, Eye, Play
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import StatCard from '../components/StatCard';
import { cn } from '../utils/cn';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { Button } from '../components/FormInput';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function Payroll() {
  const { state, dispatch, showToast } = useApp();
  const { payroll } = state;

  const [selectedMonth, setSelectedMonth] = useState('November 2024');
  const [showPayslip, setShowPayslip] = useState<string | null>(null);
  const [showProcessConfirm, setShowProcessConfirm] = useState(false);

  const stats = useMemo(() => ({
    totalPayroll: payroll.reduce((sum, p) => sum + p.netSalary, 0),
    processed: payroll.filter(p => p.status === 'processed').length,
    pending: payroll.filter(p => p.status === 'pending').length,
    totalDeductions: payroll.reduce((sum, p) => sum + p.deductions + p.pf + p.tax, 0),
  }), [payroll]);

  const payrollBreakdown = useMemo(() => [
    { name: 'Basic', value: payroll.reduce((s, p) => s + p.basicSalary, 0), color: '#6366F1' },
    { name: 'HRA', value: payroll.reduce((s, p) => s + p.hra, 0), color: '#10B981' },
    { name: 'Allowances', value: payroll.reduce((s, p) => s + p.allowances, 0), color: '#F59E0B' },
    { name: 'Deductions', value: stats.totalDeductions, color: '#EF4444' },
  ], [payroll, stats.totalDeductions]);

  const selectedPayslip = showPayslip ? payroll.find(p => p.id === showPayslip) : null;

  const handleProcessPayroll = (id: string) => {
    dispatch({ type: 'PROCESS_PAYROLL', payload: id });
    const record = payroll.find(p => p.id === id);
    showToast('success', 'Payroll Processed', `Payroll for ${record?.employeeName} has been processed.`);
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: Date.now().toString(),
        title: 'Payroll Processed',
        message: `${record?.employeeName}'s payroll has been processed for ${selectedMonth}.`,
        type: 'success',
        read: false,
        timestamp: new Date().toISOString(),
      },
    });
  };

  const handleProcessAll = () => {
    dispatch({ type: 'PROCESS_ALL_PAYROLL' });
    showToast('success', 'All Payroll Processed', `${stats.pending} payroll records have been processed.`);
    setShowProcessConfirm(false);
  };

  const exportPayroll = () => {
    const headers = ['Employee', 'Basic', 'HRA', 'Allowances', 'Deductions', 'PF', 'Tax', 'Net Salary', 'Status'];
    const rows = payroll.map(p => [
      p.employeeName, p.basicSalary, p.hra, p.allowances, p.deductions, p.pf, p.tax, p.netSalary, p.status
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payroll-${selectedMonth.replace(' ', '-')}.csv`;
    a.click();
    showToast('success', 'Export Complete', 'Payroll data has been exported.');
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Payroll" value={`$${(stats.totalPayroll / 1000).toFixed(0)}K`} change={3.5} icon={DollarSign} color="blue" />
        <StatCard title="Processed" value={stats.processed} icon={CheckCircle2} color="green" subtitle={`of ${payroll.length} employees`} />
        <StatCard title="Pending" value={stats.pending} icon={Clock} color="orange" subtitle="Awaiting processing" />
        <StatCard title="Total Deductions" value={`$${(stats.totalDeductions / 1000).toFixed(0)}K`} icon={TrendingUp} color="red" />
      </div>

      {/* Payroll Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payroll Breakdown */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="text-base font-semibold text-gray-900">Payroll Breakdown</h3>
          <p className="text-xs text-gray-500 mt-0.5">{selectedMonth}</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={payrollBreakdown} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                {payrollBreakdown.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb' }} formatter={(v: any) => `$${Number(v).toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2">
            {payrollBreakdown.map(item => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-semibold text-gray-900">${item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payroll Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="text-base font-semibold text-gray-900">Payroll Records</h3>
            <div className="flex items-center gap-2">
              <select
                value={selectedMonth}
                onChange={e => setSelectedMonth(e.target.value)}
                className="px-3 py-2 bg-gray-50 rounded-xl text-sm border-0 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
              >
                <option>November 2024</option>
                <option>October 2024</option>
                <option>September 2024</option>
              </select>
              <Button variant="secondary" size="sm" icon={<Download className="w-4 h-4" />} onClick={exportPayroll}>
                Export
              </Button>
              {stats.pending > 0 && (
                <Button size="sm" icon={<Play className="w-4 h-4" />} onClick={() => setShowProcessConfirm(true)}>
                  Process All
                </Button>
              )}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Employee</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Basic</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Deductions</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Net Pay</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {payroll.map(record => (
                  <tr key={record.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {record.employeeName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{record.employeeName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-gray-600 hidden md:table-cell">${record.basicSalary.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-sm text-red-600 hidden lg:table-cell">-${(record.deductions + record.pf + record.tax).toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">${record.netSalary.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={cn(
                        'text-[11px] font-semibold px-2.5 py-1 rounded-full',
                        record.status === 'processed' ? 'bg-emerald-100 text-emerald-700' : record.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
                      )}>
                        {record.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setShowPayslip(record.id)}
                          className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-primary-600 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {record.status === 'pending' && (
                          <button
                            onClick={() => handleProcessPayroll(record.id)}
                            className="w-8 h-8 rounded-lg hover:bg-success-50 flex items-center justify-center text-gray-400 hover:text-success-600 transition-colors"
                          >
                            <Play className="w-4 h-4" />
                          </button>
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
        title="Payslip"
        subtitle={selectedPayslip?.month}
        footer={
          <>
            <Button variant="secondary" icon={<Download className="w-4 h-4" />}>Download PDF</Button>
            <Button onClick={() => setShowPayslip(null)}>Close</Button>
          </>
        }
      >
        {selectedPayslip && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-lg font-bold">
                {selectedPayslip.employeeName.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{selectedPayslip.employeeName}</p>
                <p className="text-sm text-gray-500">{selectedPayslip.employeeId}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm"><span className="text-gray-600">Basic Salary</span><span className="font-medium">${selectedPayslip.basicSalary.toLocaleString()}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-600">HRA</span><span className="font-medium">${selectedPayslip.hra.toLocaleString()}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-600">Allowances</span><span className="font-medium">${selectedPayslip.allowances.toLocaleString()}</span></div>
              <div className="border-t border-gray-100 pt-3 flex justify-between text-sm font-semibold">
                <span>Gross Salary</span>
                <span>${(selectedPayslip.basicSalary + selectedPayslip.hra + selectedPayslip.allowances).toLocaleString()}</span>
              </div>
              <div className="border-t border-gray-100 pt-3" />
              <div className="flex justify-between text-sm"><span className="text-gray-600">Deductions</span><span className="font-medium text-red-600">-${selectedPayslip.deductions.toLocaleString()}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-600">PF</span><span className="font-medium text-red-600">-${selectedPayslip.pf.toLocaleString()}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-600">Tax</span><span className="font-medium text-red-600">-${selectedPayslip.tax.toLocaleString()}</span></div>
              <div className="border-t-2 border-gray-900 pt-3 flex justify-between text-base font-bold">
                <span>Net Salary</span>
                <span className="text-primary-600">${selectedPayslip.netSalary.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Process All Confirmation */}
      <ConfirmDialog
        isOpen={showProcessConfirm}
        onClose={() => setShowProcessConfirm(false)}
        onConfirm={handleProcessAll}
        title="Process All Payroll"
        message={`This will process payroll for ${stats.pending} pending records. This action cannot be undone.`}
        type="success"
        confirmText="Process All"
      />
    </div>
  );
}
