import { useState, useMemo } from 'react';
import {
  Package, Laptop, Monitor, Smartphone, Plus,
  Search, CheckCircle2, Wrench, AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import StatCard from '../components/StatCard';
import Modal from '../components/Modal';
import { FormInput, FormSelect, Button } from '../components/FormInput';
import { cn } from '../utils/cn';
import type { Asset } from '../types';

export default function Assets() {
  const { state, dispatch, showToast } = useApp();
  const { assets, employees } = state;

  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [assignTo, setAssignTo] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'Laptop',
    serialNumber: '',
    condition: 'excellent' as Asset['condition'],
  });

  const stats = useMemo(() => ({
    total: assets.length,
    assigned: assets.filter(a => a.status === 'assigned').length,
    available: assets.filter(a => a.status === 'available').length,
    maintenance: assets.filter(a => a.status === 'maintenance').length,
  }), [assets]);

  const types = useMemo(() => Array.from(new Set(assets.map(a => a.type))), [assets]);

  const filtered = useMemo(() => {
    return assets.filter(a => {
      const matchType = filterType === 'all' || a.type === filterType;
      const matchSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.assignedTo.toLowerCase().includes(searchQuery.toLowerCase());
      return matchType && matchSearch;
    });
  }, [assets, filterType, searchQuery]);

  const handleAddAsset = () => {
    if (!formData.name.trim() || !formData.serialNumber.trim()) {
      showToast('error', 'Validation Error', 'Please fill in all required fields.');
      return;
    }

    const newAsset: Asset = {
      id: `as${Date.now()}`,
      name: formData.name,
      type: formData.type,
      serialNumber: formData.serialNumber,
      assignedTo: '',
      assignedDate: '',
      status: 'available',
      condition: formData.condition,
    };

    dispatch({ type: 'ADD_ASSET', payload: newAsset });
    showToast('success', 'Asset Added', `${formData.name} has been added to inventory.`);
    handleCloseModal();
  };

  const handleAssign = () => {
    if (!selectedAsset || !assignTo) return;
    
    dispatch({ type: 'ASSIGN_ASSET', payload: { id: selectedAsset.id, assignedTo: assignTo } });
    showToast('success', 'Asset Assigned', `${selectedAsset.name} has been assigned to ${assignTo}.`);
    setShowAssignModal(false);
    setSelectedAsset(null);
    setAssignTo('');
  };

  const handleUnassign = (asset: Asset) => {
    dispatch({ type: 'UNASSIGN_ASSET', payload: asset.id });
    showToast('success', 'Asset Unassigned', `${asset.name} is now available.`);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setFormData({ name: '', type: 'Laptop', serialNumber: '', condition: 'excellent' });
  };

  const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
    assigned: { label: 'Assigned', color: 'bg-blue-100 text-blue-700', icon: CheckCircle2 },
    available: { label: 'Available', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
    maintenance: { label: 'Maintenance', color: 'bg-amber-100 text-amber-700', icon: Wrench },
    retired: { label: 'Retired', color: 'bg-gray-100 text-gray-600', icon: AlertTriangle },
  };

  const conditionColors: Record<string, string> = {
    excellent: 'text-emerald-600',
    good: 'text-blue-600',
    fair: 'text-amber-600',
    poor: 'text-red-600',
  };

  const typeIcons: Record<string, React.ElementType> = {
    Laptop: Laptop,
    Monitor: Monitor,
    Phone: Smartphone,
    Tablet: Smartphone,
    Accessory: Package,
    Furniture: Package,
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard title="Total Assets" value={stats.total} icon={Package} color="blue" />
        <StatCard title="Assigned" value={stats.assigned} icon={Laptop} color="green" />
        <StatCard title="Available" value={stats.available} icon={CheckCircle2} color="purple" />
        <StatCard title="In Maintenance" value={stats.maintenance} icon={Wrench} color="orange" />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search assets..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl text-sm border-0 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
          />
        </div>
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="px-3 py-2.5 bg-gray-50 rounded-xl text-sm border-0 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
        >
          <option value="all">All Types</option>
          {types.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <Button icon={<Plus className="w-4 h-4" />} onClick={() => setShowAddModal(true)}>
          Add Asset
        </Button>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(asset => {
          const config = statusConfig[asset.status];
          const TypeIcon = typeIcons[asset.type] || Package;
          return (
            <div key={asset.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:shadow-gray-100/50 transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                  <TypeIcon className="w-5 h-5 text-primary-600" />
                </div>
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${config.color}`}>
                  {config.label}
                </span>
              </div>
              <h4 className="text-sm font-semibold text-gray-900">{asset.name}</h4>
              <p className="text-xs text-gray-500 mt-0.5">{asset.type} · {asset.serialNumber}</p>
              <div className="mt-3 space-y-1.5">
                {asset.assignedTo && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="font-medium text-gray-700">Assigned to:</span> {asset.assignedTo}
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-gray-500">Condition:</span>
                  <span className={cn('font-medium capitalize', conditionColors[asset.condition])}>
                    {asset.condition}
                  </span>
                </div>
                {asset.assignedDate && (
                  <div className="text-[11px] text-gray-400">
                    Since {new Date(asset.assignedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                )}
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {asset.status === 'available' ? (
                  <Button
                    size="sm"
                    fullWidth
                    onClick={() => { setSelectedAsset(asset); setShowAssignModal(true); }}
                  >
                    Assign
                  </Button>
                ) : asset.status === 'assigned' && (
                  <Button
                    size="sm"
                    variant="secondary"
                    fullWidth
                    onClick={() => handleUnassign(asset)}
                  >
                    Unassign
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No assets found</p>
        </div>
      )}

      {/* Add Asset Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={handleCloseModal}
        title="Add New Asset"
        subtitle="Add a new asset to the inventory"
        footer={
          <>
            <Button variant="ghost" onClick={handleCloseModal}>Cancel</Button>
            <Button onClick={handleAddAsset}>Add Asset</Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormInput
            label="Asset Name"
            value={formData.name}
            onChange={(v) => setFormData({ ...formData, name: v })}
            placeholder="MacBook Pro 16"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <FormSelect
              label="Type"
              value={formData.type}
              onChange={(v) => setFormData({ ...formData, type: v })}
              options={[
                { value: 'Laptop', label: 'Laptop' },
                { value: 'Monitor', label: 'Monitor' },
                { value: 'Phone', label: 'Phone' },
                { value: 'Tablet', label: 'Tablet' },
                { value: 'Accessory', label: 'Accessory' },
                { value: 'Furniture', label: 'Furniture' },
              ]}
            />
            <FormSelect
              label="Condition"
              value={formData.condition}
              onChange={(v) => setFormData({ ...formData, condition: v as Asset['condition'] })}
              options={[
                { value: 'excellent', label: 'Excellent' },
                { value: 'good', label: 'Good' },
                { value: 'fair', label: 'Fair' },
                { value: 'poor', label: 'Poor' },
              ]}
            />
          </div>
          <FormInput
            label="Serial Number"
            value={formData.serialNumber}
            onChange={(v) => setFormData({ ...formData, serialNumber: v })}
            placeholder="SN-2024-001"
            required
          />
        </div>
      </Modal>

      {/* Assign Modal */}
      <Modal
        isOpen={showAssignModal}
        onClose={() => { setShowAssignModal(false); setSelectedAsset(null); setAssignTo(''); }}
        title="Assign Asset"
        subtitle={`Assign ${selectedAsset?.name} to an employee`}
        footer={
          <>
            <Button variant="ghost" onClick={() => { setShowAssignModal(false); setSelectedAsset(null); setAssignTo(''); }}>Cancel</Button>
            <Button onClick={handleAssign} disabled={!assignTo}>Assign</Button>
          </>
        }
      >
        <FormSelect
          label="Assign to Employee"
          value={assignTo}
          onChange={setAssignTo}
          options={[
            { value: '', label: 'Select employee...' },
            ...employees.filter(e => e.status === 'active').map(e => ({ value: e.name, label: e.name }))
          ]}
          required
        />
      </Modal>
    </div>
  );
}
