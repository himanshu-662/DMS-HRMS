import { 
  Building2, Shield, Bell, Plug, Globe, Palette, Save, 
  Moon, ChevronRight, CheckCircle2, Mail, Smartphone,
  Monitor, Lock, Layout, Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../utils/cn';
import { useState } from 'react';
import { Button, FormInput } from '../components/FormInput';

const settingSections = [
  { id: 'organization', title: 'Organization', icon: Building2, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  { id: 'notifications', title: 'Notifications', icon: Bell, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  { id: 'access', title: 'Security', icon: Shield, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { id: 'modules', title: 'Modules', icon: Plug, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
  { id: 'branding', title: 'Branding', icon: Palette, color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
];

export default function Settings() {
  const { state, showToast, updateSettings } = useApp();
  const [activeSection, setActiveSection] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  // Unified settings state
  const [localSettings, setLocalSettings] = useState(state.settings);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    await updateSettings(localSettings);
    setIsSaving(false);
  };

  const updateSetting = (key, value) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const renderSectionContent = () => {
    const section = settingSections[activeSection];

    switch (section.id) {
      case 'organization':
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Company name"
                value={localSettings.company_name}
                onChange={(v) => updateSetting('company_name', v)}
              />
              <FormInput
                label="Company website"
                value={localSettings.website || ''}
                onChange={(v) => updateSetting('website', v)}
                placeholder="https://example.com"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-zinc-800">
              <FormInput
                label="Street address"
                value={localSettings.address || ''}
                onChange={(v) => updateSetting('address', v)}
                placeholder="123 Business St"
              />
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="City"
                  value={localSettings.city || ''}
                  onChange={(v) => updateSetting('city', v)}
                />
                <FormInput
                  label="State"
                  value={localSettings.state || ''}
                  onChange={(v) => updateSetting('state', v)}
                />
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6 animate-fade-in">
            {[
              { id: 'email_notif', label: 'Email notifications', desc: 'Send daily summaries to employees', icon: Mail },
              { id: 'push_notif', label: 'Push notifications', desc: 'Real-time browser notifications', icon: Monitor },
              { id: 'sms_notif', label: 'SMS alerts', desc: 'Emergency and critical alerts', icon: Smartphone },
            ].map(item => (
              <div key={item.id} className="flex items-center justify-between p-5 bg-zinc-950 rounded-2xl border border-zinc-800">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-500">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{item.label}</p>
                    <p className="text-[10px] text-zinc-600 mt-0.5">{item.desc}</p>
                  </div>
                </div>
                <button
                  onClick={() => updateSetting(item.id, !localSettings[item.id])}
                  className={cn(
                    "w-11 h-6 rounded-full transition-all relative",
                    localSettings[item.id] ? "bg-primary-600" : "bg-zinc-800"
                  )}>
                  <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-all", localSettings[item.id] ? "left-6" : "left-1")} />
                </button>
              </div>
            ))}
          </div>
        );

      case 'access':
        return (
          <div className="space-y-6 animate-fade-in">
            {[
              { id: '2fa_enabled', label: 'Two-factor authentication', desc: 'Add extra layer of security', icon: Lock },
              { id: 'session_timeout', label: 'Auto logout', desc: 'Logout after 30 mins of inactivity', icon: Clock },
              { id: 'ip_restriction', label: 'IP restriction', desc: 'Limit access to office network', icon: Globe },
            ].map(item => (
              <div key={item.id} className="flex items-center justify-between p-5 bg-zinc-950 rounded-2xl border border-zinc-800">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-500">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{item.label}</p>
                    <p className="text-[10px] text-zinc-600 mt-0.5">{item.desc}</p>
                  </div>
                </div>
                <button
                  onClick={() => updateSetting(item.id, !localSettings[item.id])}
                  className={cn(
                    "w-11 h-6 rounded-full transition-all relative",
                    localSettings[item.id] ? "bg-primary-600" : "bg-zinc-800"
                  )}>
                  <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-all", localSettings[item.id] ? "left-6" : "left-1")} />
                </button>
              </div>
            ))}
          </div>
        );

      case 'modules':
        return (
          <div className="space-y-6 animate-fade-in">
            {[
              { id: 'gps_attendance', label: 'GPS attendance', desc: 'Mark attendance only from office', icon: MapPin },
              { id: 'auto_gen_id', label: 'Auto employee ID', desc: 'Generate IDs automatically', icon: Zap },
              { id: 'self_onboarding', label: 'Self onboarding', desc: 'Allow employees to fill details', icon: UserPlus },
            ].map(item => (
              <div key={item.id} className="flex items-center justify-between p-5 bg-zinc-950 rounded-2xl border border-zinc-800">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-500">
                    <item.icon className={cn("w-5 h-5", item.id === 'gps_attendance' ? 'lucide-map-pin' : '')} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{item.label}</p>
                    <p className="text-[10px] text-zinc-600 mt-0.5">{item.desc}</p>
                  </div>
                </div>
                <button
                  onClick={() => updateSetting(item.id, !localSettings[item.id])}
                  className={cn(
                    "w-11 h-6 rounded-full transition-all relative",
                    localSettings[item.id] ? "bg-primary-600" : "bg-zinc-800"
                  )}>
                  <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-all", localSettings[item.id] ? "left-6" : "left-1")} />
                </button>
              </div>
            ))}
          </div>
        );

      case 'branding':
        return (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h4 className="text-xs font-bold text-white mb-6 uppercase">Color theme</h4>
              <div className="flex flex-wrap gap-4 p-6 bg-zinc-950 rounded-2xl border border-zinc-800">
                {['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#8B5CF6', '#06B6D4'].map(color => (
                  <button
                    key={color}
                    onClick={() => updateSetting('primary_color', color)}
                    className={cn(
                      "w-10 h-10 rounded-xl transition-all relative border border-white/5",
                      localSettings.primary_color === color ? "ring-2 ring-white ring-offset-4 ring-offset-zinc-950 scale-110 shadow-lg" : "opacity-40 hover:opacity-100"
                    )}
                    style={{ backgroundColor: color }}>
                    {localSettings.primary_color === color && <CheckCircle2 className="w-4 h-4 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-zinc-800">
              <FormInput
                label="Custom font"
                value={localSettings.font_family || 'Inter'}
                onChange={(v) => updateSetting('font_family', v)}
              />
              <FormInput
                label="Layout style"
                value={localSettings.layout || 'Modern'}
                onChange={(v) => updateSetting('layout', v)}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const MapPin = ({className}) => <Globe className={className} />;
  const UserPlus = ({className}) => <Layout className={className} />;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
          <p className="text-sm text-zinc-500 mt-1">Configure system parameters and company profile.</p>
        </div>
        <Button 
          className="h-11 px-8 rounded-xl text-xs font-bold bg-primary-600 hover:bg-primary-500 border-0"
          onClick={handleSave}
          disabled={isSaving}
          icon={isSaving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}>
          Save changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-3">
          {settingSections.map((section, idx) => {
            const Icon = section.icon;
            const isActive = activeSection === idx;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(idx)}
                className={cn(
                  'w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left group',
                  isActive ?
                    'border-primary-500/30 bg-primary-500/5' :
                    'border-zinc-800 bg-zinc-900 hover:border-zinc-700'
                )}>
                <div className={cn(
                  'w-11 h-11 rounded-xl flex items-center justify-center transition-all',
                  isActive ? "bg-primary-500 text-black shadow-lg shadow-primary-500/20" : cn(section.bg, section.color, 'border', section.border)
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className={cn('text-sm font-bold', isActive ? 'text-white' : 'text-zinc-400 group-hover:text-white')}>
                    {section.title}
                  </p>
                  <p className="text-[10px] text-zinc-600 mt-0.5 capitalize">Manage {section.id}</p>
                </div>
                <ChevronRight className={cn('w-4 h-4 transition-transform', isActive ? 'text-primary-500 rotate-90 md:rotate-0' : 'text-zinc-800')} />
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-8 bg-zinc-900 rounded-[2.5rem] border border-zinc-800 p-8 lg:p-10 shadow-2xl min-h-[600px]">
          <div className="flex items-center gap-4 mb-10 pb-6 border-b border-zinc-800/50">
            <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center border', settingSections[activeSection].bg, settingSections[activeSection].color, settingSections[activeSection].border)}>
              {(() => {const Icon = settingSections[activeSection].icon; return <Icon className="w-6 h-6" />;})()}
            </div>
            <div>
              <h4 className="text-xl font-bold text-white">{settingSections[activeSection].title} settings</h4>
              <p className="text-xs text-zinc-500 mt-0.5">Customize your workspace experience.</p>
            </div>
          </div>

          {renderSectionContent()}
        </div>
      </div>
    </div>
  );
}
