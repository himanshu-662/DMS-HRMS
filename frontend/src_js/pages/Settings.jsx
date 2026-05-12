import { useState } from 'react';
import { Building2, Globe, Shield, Bell, Palette, Plug, ChevronRight, Moon, Sun, Save, CheckCircle2 } from 'lucide-react';
import { cn } from '../utils/cn';
import { useApp } from '../context/AppContext';
const settingSections = [
    {
        id: 'organization',
        title: 'Organization',
        icon: Building2,
        color: 'bg-blue-50 text-blue-600',
        items: ['Company Profile', 'Departments', 'Locations', 'Designations'],
    },
    {
        id: 'access',
        title: 'Access Control',
        icon: Shield,
        color: 'bg-red-50 text-red-600',
        items: ['Roles & Permissions', 'User Management', 'IP Restrictions', 'Session Settings'],
    },
    {
        id: 'notifications',
        title: 'Notifications',
        icon: Bell,
        color: 'bg-amber-50 text-amber-600',
        items: ['Email Notifications', 'Push Notifications', 'SMS Alerts', 'Notification Templates'],
    },
    {
        id: 'modules',
        title: 'Modules',
        icon: Plug,
        color: 'bg-violet-50 text-violet-600',
        items: ['Attendance Settings', 'Leave Policies', 'Payroll Configuration', 'Recruitment Settings'],
    },
    {
        id: 'integrations',
        title: 'Integrations',
        icon: Globe,
        color: 'bg-emerald-50 text-emerald-600',
        items: ['Slack', 'Microsoft Teams', 'Google Workspace', 'Payment Gateway'],
    },
    {
        id: 'branding',
        title: 'Branding',
        icon: Palette,
        color: 'bg-pink-50 text-pink-600',
        items: ['Logo & Colors', 'Email Templates', 'Career Page', 'Custom Domain'],
    },
];
export default function Settings() {
    const { state, dispatch, showToast, updateSettings } = useApp();
    const [activeSection, setActiveSection] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    // Form states
    const [companyName, setCompanyName] = useState(state.settings.company_name || 'DMS HRMS');
    const [gpsEnabled, setGpsEnabled] = useState(state.settings.gps_attendance || false);
    const [autoGenId, setAutoGenId] = useState(state.settings.auto_gen_id || true);
    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        await updateSettings({
            company_name: companyName,
            gps_attendance: gpsEnabled,
            auto_gen_id: autoGenId,
        });
        setIsSaving(false);
    };
    const renderSectionContent = () => {
        const section = settingSections[activeSection];
        if (section.id === 'organization') {
            return (<div className="space-y-6">
          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">Company Profile</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase">Company Name</label>
                <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"/>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase">Website URL</label>
                <input type="text" placeholder="https://dms.com" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none"/>
              </div>
            </div>
          </div>
          
          <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">Address Information</h4>
            <div className="grid grid-cols-1 gap-4">
              <input type="text" placeholder="Street Address" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none"/>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="City" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none"/>
                <input type="text" placeholder="Country" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none"/>
              </div>
            </div>
          </div>
        </div>);
        }
        if (section.id === 'modules') {
            return (<div className="space-y-6">
          <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">Attendance Rules</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">GPS Restricted Attendance</p>
                <p className="text-xs text-gray-500">Allow check-in only from designated office locations</p>
              </div>
              <button onClick={() => setGpsEnabled(!gpsEnabled)} className={cn("w-12 h-6 rounded-full transition-all relative", gpsEnabled ? "bg-primary-600" : "bg-gray-300 dark:bg-gray-700")}>
                <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-all", gpsEnabled ? "left-7" : "left-1")}/>
              </button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">Auto-generate Employee IDs</p>
                <p className="text-xs text-gray-500">System will automatically assign unique IDs to new hires</p>
              </div>
              <button onClick={() => setAutoGenId(!autoGenId)} className={cn("w-12 h-6 rounded-full transition-all relative", autoGenId ? "bg-primary-600" : "bg-gray-300 dark:bg-gray-700")}>
                <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-all", autoGenId ? "left-7" : "left-1")}/>
              </button>
            </div>
          </div>
        </div>);
        }
        return (<div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <Plug className="w-8 h-8 text-gray-300"/>
        </div>
        <h5 className="text-sm font-bold text-gray-900 dark:text-white">Section Under Development</h5>
        <p className="text-xs text-gray-500 mt-1 max-w-[200px]">We're currently implementing the advanced features for {section.title.toLowerCase()}.</p>
      </div>);
    };
    return (<div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 p-8 shadow-sm">
        <div>
          <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Platform Settings</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">Configure your core system preferences and workflow rules</p>
        </div>
        <button onClick={handleSave} disabled={isSaving} className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-primary-600/30 disabled:opacity-50 group">
          {isSaving ? (<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/>) : (<>
              <Save className="w-4 h-4 group-hover:scale-110 transition-transform"/>
              Save Changes
            </>)}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Navigation */}
        <div className="lg:col-span-4 space-y-3">
          {settingSections.map((section, idx) => {
            const Icon = section.icon;
            return (<button key={section.id} onClick={() => setActiveSection(idx)} className={cn('w-full flex items-center gap-4 p-5 rounded-[1.5rem] border-2 transition-all text-left group relative overflow-hidden', activeSection === idx
                    ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/10 shadow-lg'
                    : 'border-white dark:border-gray-800 bg-white dark:bg-gray-800 hover:border-gray-100 dark:hover:border-gray-700')}>
                <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110', activeSection === idx ? "bg-primary-600 text-white" : section.color)}>
                  <Icon className="w-6 h-6"/>
                </div>
                <div className="flex-1">
                  <p className={cn('text-sm font-black tracking-tight', activeSection === idx ? 'text-primary-900 dark:text-primary-100' : 'text-gray-900 dark:text-white')}>
                    {section.title}
                  </p>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{section.items.length} configuration modules</p>
                </div>
                <ChevronRight className={cn('w-4 h-4 transition-transform', activeSection === idx ? 'text-primary-500 translate-x-1' : 'text-gray-300')}/>
              </button>);
        })}
        </div>

        {/* Content */}
        <div className="lg:col-span-8 bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center', settingSections[activeSection].color)}>
                {(() => { const Icon = settingSections[activeSection].icon; return <Icon className="w-6 h-6"/>; })()}
              </div>
              <div>
                <h4 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">{settingSections[activeSection].title} Management</h4>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Active configuration pane</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 text-primary-600 dark:text-primary-400 font-bold text-[10px] uppercase bg-primary-50 dark:bg-primary-900/20 px-3 py-1.5 rounded-full">
              <CheckCircle2 className="w-3 h-3"/> System Verified
            </div>
          </div>

          <div className="min-h-[400px]">
            {renderSectionContent()}
          </div>

          {/* Theme & Quick Settings */}
          <div className="mt-12 pt-8 border-t-2 border-dashed border-gray-100 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Appearance Mode</h4>
              <div className="flex items-center justify-between p-5 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm">
                    {state.darkMode ? <Moon className="w-5 h-5 text-primary-500"/> : <Sun className="w-5 h-5 text-amber-500"/>}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">Dark Theme</p>
                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Interface styling</p>
                  </div>
                </div>
                <button onClick={() => {
            dispatch({ type: 'TOGGLE_DARK_MODE' });
            showToast('success', 'Theme Changed', `Switched to ${state.darkMode ? 'light' : 'dark'} mode`);
        }} className={cn('w-12 h-6 rounded-full transition-all relative', state.darkMode ? 'bg-primary-600' : 'bg-gray-300')}>
                  <div className={cn('absolute top-1 w-4 h-4 rounded-full bg-white transition-all', state.darkMode ? 'left-7' : 'left-1')}/>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Session Security</h4>
              <div className="flex items-center justify-between p-5 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm">
                    <Shield className="w-5 h-5 text-emerald-500"/>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">2FA Enabled</p>
                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Multi-factor auth</p>
                  </div>
                </div>
                <div className="w-12 h-6 rounded-full bg-primary-600 relative opacity-50 cursor-not-allowed">
                  <div className="absolute top-1 left-7 w-4 h-4 rounded-full bg-white"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
}
