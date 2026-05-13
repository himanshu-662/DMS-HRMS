import { useState, useMemo } from 'react';
import {
  Package, Laptop, Monitor, Smartphone, Plus,
  Search, CheckCircle2, Wrench, AlertTriangle } from
'lucide-react';
import { useApp } from '../context/AppContext';
import StatCard from '../components/StatCard';
import Modal from '../components/Modal';
import { FormInput, FormSelect, Button } from '../components/FormInput';
import { cn } from '../utils/cn';


export default function Assets() {
  const { state, dispatch, showToast } = useApp();
  const { assets, employees } = state;

  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [assignTo, setAssignTo] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    type: 'Laptop',
    serialNumber: '',
    condition: 'excellent'
  });

  const stats = useMemo(() => ({
    total: assets.length,
    assigned: assets.filter((a) => a.status === 'assigned').length,
    available: assets.filter((a) => a.status === 'available').length,
    maintenance: assets.filter((a) => a.status === 'maintenance').length
  }), [assets]);

  const types = useMemo(() => Array.from(new Set(assets.map((a) => a.type))), [assets]);

  const filtered = useMemo(() => {
    return assets.filter((a) => {
      const matchType = filterType === 'all' || a.type === filterType;
      const matchSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.assignedTo.toLowerCase().includes(searchQuery.toLowerCase());
      return matchType && matchSearch;
    });
  }, [assets, filterType, searchQuery]);

  const handleAddAsset = () => {
    if (!formData.name.trim() || !formData.serialNumber.trim()) {
      showToast('error', 'Validation Error', 'Asset details are required.');
      return;
    }

    const newAsset = {
      id: `as${Date.now()}`,
      name: formData.name,
      type: formData.type,
      serialNumber: formData.serialNumber,
      assignedTo: '',
      assignedDate: '',
      status: 'available',
      condition: formData.condition
    };

    dispatch({ type: 'ADD_ASSET', payload: newAsset });
    showToast('success', 'Asset Added', `${formData.name} added to inventory.`);
    handleCloseModal();
  };

  const handleAssign = () => {
    if (!selectedAsset || !assignTo) return;

    dispatch({ type: 'ASSIGN_ASSET', payload: { id: selectedAsset.id, assignedTo: assignTo } });
    showToast('success', 'Asset Assigned', `${selectedAsset.name} assigned to ${assignTo}.`);
    setShowAssignModal(false);
    setSelectedAsset(null);
    setAssignTo('');
  };

  const handleUnassign = (asset) => {
    dispatch({ type: 'UNASSIGN_ASSET', payload: asset.id });
    showToast('success', 'Asset Unassigned', `${asset.name} returned to available pool.`);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setFormData({ name: '', type: 'Laptop', serialNumber: '', condition: 'excellent' });
  };

  const statusConfig = {
    assigned: { label: 'ASSIGNED', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: CheckCircle2 },
    available: { label: 'AVAILABLE', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: CheckCircle2 },
    maintenance: { label: 'MAINTENANCE', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20', icon: Wrench },
    retired: { label: 'RETIRED', color: 'bg-zinc-800 text-zinc-500 border-zinc-700', icon: AlertTriangle }
  };

  const conditionColors = {
    excellent: 'text-emerald-500',
    good: 'text-blue-500',
    fair: 'text-amber-500',
    poor: 'text-red-500'
  };

  const typeIcons = {
    Laptop: Laptop,
    Monitor: Monitor,
    Phone: Smartphone,
    Tablet: Smartphone,
    Accessory: Package,
    Furniture: Package
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Asset Management</h1>
          <p className="text-sm text-zinc-500 mt-1">Track and manage company equipment and hardware.</p>
        </div>
        <Button 
          className="h-11 px-6 rounded-xl text-xs font-bold bg-primary-600 hover:bg-primary-500 border-0"
          onClick={() => setShowAddModal(true)}
          icon={<Plus className="w-4 h-4" />}>
          Add Asset
        </Button>
      </div>

      {/* Stats cluster */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {[
          { label: 'Total Assets', value: stats.total, icon: Package, color: 'text-primary-400', bg: 'bg-primary-500/10' },
          { label: 'Assigned', value: stats.assigned, icon: Laptop, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Available', value: stats.available, icon: CheckCircle2, color: 'text-violet-400', bg: 'bg-violet-500/10' },
          { label: 'Maintenance', value: stats.maintenance, icon: Wrench, color: 'text-amber-400', bg: 'bg-amber-500/10' }
        ].map((stat) => (
          <div key={stat.label} className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 flex flex-col items-start group">
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-4 transition-transform`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-3 flex flex-col lg:flex-row items-stretch lg:items-center gap-3 shadow-xl">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by name, serial, or assignee..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-zinc-950/50 rounded-xl text-xs font-bold border border-zinc-800 text-white focus:outline-none focus:ring-1 focus:ring-primary-500 placeholder:text-zinc-600" />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-6 py-2.5 bg-zinc-950/50 rounded-xl text-xs font-bold border border-zinc-800 text-zinc-400 focus:outline-none focus:ring-1 focus:ring-primary-500 appearance-none">
          <option value="all">Type: All</option>
          {types.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((asset) => {
          const config = statusConfig[asset.status];
          const TypeIcon = typeIcons[asset.type] || Package;
          return (
            <div key={asset.id} className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 hover:border-zinc-700 transition-all group flex flex-col">
              <div className="flex items-start justify-between mb-6">
                <div className="w-11 h-11 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                  <TypeIcon className="w-5 h-5 text-primary-400" />
                </div>
                <span className={cn(
                  'text-[9px] font-bold px-2 py-1 rounded-lg border uppercase tracking-wider',
                  config.color
                )}>
                  {config.label}
                </span>
              </div>
              
              <h4 className="text-sm font-bold text-white group-hover:text-primary-400 transition-colors truncate">{asset.name}</h4>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mt-1">{asset.type} · {asset.serialNumber}</p>
              
              <div className="mt-6 pt-6 border-t border-zinc-800/50 flex-1 flex flex-col justify-between">
                <div>
                  {asset.assignedTo ? (
                    <div className="mb-4">
                      <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-wider">Assigned To</p>
                      <p className="text-xs font-bold text-white mt-1 uppercase">{asset.assignedTo}</p>
                    </div>
                  ) : (
                    <div className="mb-4 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <p className="text-[9px] font-bold text-emerald-500/70 uppercase tracking-wider">Available</p>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-wider">Condition</span>
                    <span className={cn('text-[9px] font-bold uppercase', conditionColors[asset.condition])}>
                      {asset.condition}
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  {asset.status === 'available' ? (
                    <Button
                      fullWidth
                      className="h-10 rounded-xl bg-white text-black hover:bg-zinc-200 text-[10px] font-bold uppercase tracking-wider border-0"
                      onClick={() => {setSelectedAsset(asset);setShowAssignModal(true);}}>
                      Assign Asset
                    </Button>
                  ) : asset.status === 'assigned' && (
                    <Button
                      fullWidth
                      variant="secondary"
                      className="h-10 rounded-xl bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-[10px] font-bold uppercase tracking-wider"
                      onClick={() => handleUnassign(asset)}>
                      Unassign Asset
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-20 text-center shadow-xl">
          <Package className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">No assets found</p>
        </div>
      )}

      {/* Add Asset Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={handleCloseModal}
        title="Add New Asset"
        subtitle="Register a new equipment into inventory."
        size="lg"
        footer={
          <div className="flex gap-3">
            <Button className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 h-11 px-6 rounded-xl text-xs font-bold" onClick={handleCloseModal}>Cancel</Button>
            <Button className="bg-primary-600 hover:bg-primary-500 h-11 px-8 rounded-xl text-xs font-bold border-0" onClick={handleAddAsset}>Add Asset</Button>
          </div>
        }>
        
        <div className="space-y-6">
          <FormInput
            label="Asset Name"
            value={formData.name}
            onChange={(v) => setFormData({ ...formData, name: v })}
            placeholder="e.g. MacBook Pro M2"
            required />
          
          <div className="grid grid-cols-2 gap-4">
            <FormSelect
              label="Asset Type"
              value={formData.type}
              onChange={(v) => setFormData({ ...formData, type: v })}
              options={[
                { value: 'Laptop', label: 'Laptop' },
                { value: 'Monitor', label: 'Monitor' },
                { value: 'Phone', label: 'Smartphone' },
                { value: 'Tablet', label: 'Tablet' },
                { value: 'Accessory', label: 'Accessory' },
                { value: 'Furniture', label: 'Furniture' }
              ]} />
            
            <FormSelect
              label="Condition"
              value={formData.condition}
              onChange={(v) => setFormData({ ...formData, condition: v })}
              options={[
                { value: 'excellent', label: 'Excellent' },
                { value: 'good', label: 'Good' },
                { value: 'fair', label: 'Fair' },
                { value: 'poor', label: 'Poor' }
              ]} />
          </div>

          <FormInput
            label="Serial Number"
            value={formData.serialNumber}
            onChange={(v) => setFormData({ ...formData, serialNumber: v })}
            placeholder="Enter SN..."
            required />
        </div>
      </Modal>

      {/* Assign Modal */}
      <Modal
        isOpen={showAssignModal}
        onClose={() => {setShowAssignModal(false);setSelectedAsset(null);setAssignTo('');}}
        title="Assign Asset"
        subtitle={`Assigning ${selectedAsset?.name} to employee.`}
        footer={
          <div className="flex gap-3">
            <Button className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 h-11 px-6 rounded-xl text-xs font-bold" onClick={() => {setShowAssignModal(false);setSelectedAsset(null);setAssignTo('');}}>Cancel</Button>
            <Button className="bg-primary-600 hover:bg-primary-500 h-11 px-8 rounded-xl text-xs font-bold border-0" onClick={handleAssign} disabled={!assignTo}>Assign Asset</Button>
          </div>
        }>
        
        <div className="p-2">
          <FormSelect
            label="Select Employee"
            value={assignTo}
            onChange={setAssignTo}
            options={[
              { value: '', label: 'Select Employee...' },
              ...employees.filter((e) => e.status === 'active').map((e) => ({ value: e.name, label: e.name.toUpperCase() }))
            ]}
            required />
        </div>
      </Modal>
    </div>
  );
}


