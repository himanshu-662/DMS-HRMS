import { useState, useEffect } from 'react';
import { 
  Building, Search, Plus, MoreVertical, 
  ExternalLink, Ban, Trash2, CheckCircle2,
  Filter, Download, ChevronRight, Globe,
  Shield, CreditCard, Activity, ArrowUpDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/FormInput';
import { cn } from '../utils/cn';

export default function OrganizationManagement() {
  const { state, dispatch, showToast, api } = useApp();
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newOrg, setNewOrg] = useState({ company_name: '', plan: 'basic', max_employees: 50 });

  const fetchOrganizations = async () => {
    try {
      const response = await api.get('/api/super-admin/organizations');
      setOrganizations(response.data);
    } catch (err) {
      showToast('error', 'Failed to fetch organizations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const handleCreateOrg = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/super-admin/organizations', newOrg);
      showToast('success', 'Organization Created', 'New tenant successfully added to the platform.');
      setShowAddModal(false);
      setNewOrg({ company_name: '', plan: 'basic', max_employees: 50 });
      fetchOrganizations();
    } catch (err) {
      showToast('error', 'Failed to create organization');
    }
  };

  const handleStatusUpdate = async (orgId, status) => {
    try {
      await api.patch(`/api/super-admin/organizations/${orgId}`, { status });
      showToast('success', 'Status Updated', `Organization is now ${status}.`);
      fetchOrganizations();
    } catch (err) {
      showToast('error', 'Failed to update status');
    }
  };

  const filtered = organizations.filter(org => 
    org.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    org.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSwitchContext = (orgId) => {
    const isCurrent = state.orgContext === orgId;
    const newContext = isCurrent ? null : orgId;
    
    dispatch({ type: 'SET_ORG_CONTEXT', payload: newContext });
    showToast(
      isCurrent ? 'info' : 'success', 
      isCurrent ? 'Global View Restored' : 'Context Switched', 
      isCurrent ? 'Now viewing data across all organizations.' : `Now viewing data for ${organizations.find(o => o.id === orgId)?.company_name}.`
    );
  };

  const planColors = {
    enterprise: 'text-violet-400 bg-violet-400/10 border-violet-400/20',
    business: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    basic: 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20'
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Organization Management</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage tenants, subscription plans, and platform-wide configurations.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            className="bg-primary-600 hover:bg-primary-500 text-xs font-bold px-6 shadow-lg shadow-primary-900/20" 
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setShowAddModal(true)}>
            Onboard Organization
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Building className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Active Tenants</span>
          </div>
          <p className="text-3xl font-bold text-white">{organizations.filter(o => o.status === 'active').length}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-500">
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Enterprise Plans</span>
          </div>
          <p className="text-3xl font-bold text-white">{organizations.filter(o => o.subscription_plan === 'enterprise').length}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Recent Activity</span>
          </div>
          <p className="text-3xl font-bold text-white">48</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-primary-500 transition-colors" />
          <input
            type="text"
            placeholder="Search by organization name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-zinc-900 rounded-xl text-sm font-medium border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/50 transition-all text-white" />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-xs font-bold px-4" icon={<Filter className="w-4 h-4" />}>Filters</Button>
          <Button variant="ghost" className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-xs font-bold px-4" icon={<Download className="w-4 h-4" />}>Export</Button>
        </div>
      </div>

      {/* Organization List */}
      <div className="bg-zinc-900 rounded-[2.5rem] border border-zinc-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-zinc-950 border-b border-zinc-800">
                <th className="text-left px-8 py-5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Organization</th>
                <th className="text-left px-8 py-5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">ID</th>
                <th className="text-left px-8 py-5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Status</th>
                <th className="text-left px-8 py-5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Plan</th>
                <th className="text-left px-8 py-5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Modules</th>
                <th className="text-right px-8 py-5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filtered.map((org) => (
                <tr key={org.id} className="hover:bg-zinc-800/30 transition-all group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 font-bold text-sm">
                        {org.company_name[0]}
                      </div>
                      <span className="text-sm font-bold text-white group-hover:text-primary-400 transition-colors">{org.company_name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <code className="text-[10px] font-bold text-zinc-500 bg-zinc-950 px-2 py-1 rounded border border-zinc-800">{org.id}</code>
                  </td>
                  <td className="px-8 py-5">
                    <span className={cn(
                      "text-[9px] font-black uppercase tracking-tighter px-2 py-1 rounded border",
                      org.status === 'active' ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' : 'text-rose-500 bg-rose-500/10 border-rose-500/20'
                    )}>
                      {org.status}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className={cn(
                      "text-[9px] font-black uppercase tracking-tighter px-2 py-1 rounded border",
                      planColors[org.subscription_plan] || planColors.basic
                    )}>
                      {org.subscription_plan}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex gap-1">
                      {org.modules_enabled?.slice(0, 2).map(m => (
                        <div key={m} className="w-1.5 h-1.5 rounded-full bg-primary-500" title={m} />
                      ))}
                      {org.modules_enabled?.length > 2 && (
                        <span className="text-[9px] text-zinc-600 font-bold">+{org.modules_enabled.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button 
                        onClick={() => handleSwitchContext(org.id)}
                        className={cn(
                          "p-2 rounded-lg transition-all border",
                          state.orgContext === org.id 
                            ? "bg-primary-500/10 border-primary-500/50 text-primary-500" 
                            : "bg-zinc-800 border-transparent text-zinc-400 hover:text-white"
                        )} 
                        title={state.orgContext === org.id ? "Clear Context" : "Switch Context"}>
                        <Globe className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(org.id, org.status === 'active' ? 'suspended' : 'active')}
                        className="p-2 bg-zinc-800 border border-transparent hover:bg-zinc-750 rounded-lg text-zinc-400 hover:text-white transition-all" title="Toggle Status">
                        {org.status === 'active' ? <Ban className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                      </button>
                      <button className="p-2 bg-zinc-800 border border-transparent hover:bg-zinc-750 rounded-lg text-zinc-400 hover:text-white transition-all" title="View Dashboard">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-zinc-800 border border-transparent hover:bg-zinc-750 rounded-lg text-zinc-400 hover:text-rose-500 transition-all" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-scale-up">
            <div className="p-8 border-b border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">Onboard Organization</h3>
                <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest font-bold">Platform Manual Provisioning</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-zinc-800 rounded-full transition-all">
                <Trash2 className="w-5 h-5 text-zinc-500" />
              </button>
            </div>
            
            <form onSubmit={handleCreateOrg} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Company Name</label>
                <input
                  required
                  type="text"
                  value={newOrg.company_name}
                  onChange={(e) => setNewOrg({...newOrg, company_name: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary-500 transition-all"
                  placeholder="e.g. Acme Corp" />
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Subscription Plan</label>
                  <select
                    value={newOrg.plan}
                    onChange={(e) => setNewOrg({...newOrg, plan: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary-500 transition-all appearance-none">
                    <option value="basic">Basic</option>
                    <option value="business">Business</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Employee Limit</label>
                  <input
                    type="number"
                    value={newOrg.max_employees}
                    onChange={(e) => setNewOrg({...newOrg, max_employees: parseInt(e.target.value)})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary-500 transition-all" />
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-4 bg-zinc-800 hover:bg-zinc-750 text-xs font-bold uppercase tracking-widest rounded-2xl">
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="flex-1 py-4 bg-primary-600 hover:bg-primary-500 text-xs font-bold uppercase tracking-widest rounded-2xl shadow-xl shadow-primary-900/20">
                  Provision Tenant
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
