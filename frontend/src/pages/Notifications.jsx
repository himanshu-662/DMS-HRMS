import { useState, useMemo } from 'react';
import { 
  Bell, CheckCircle2, AlertCircle, Info, 
  Trash2, Filter, MoreHorizontal, Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../utils/cn';
import { Button } from '../components/FormInput';

export default function Notifications() {
  const { state, dispatch, showToast } = useApp();
  const { notifications } = state;
  const [activeTab, setActiveTab] = useState('all');

  const filteredNotifications = useMemo(() => {
    if (activeTab === 'all') return notifications;
    return notifications.filter(n => n.category === activeTab);
  }, [notifications, activeTab]);

  const categories = [
    { id: 'all', label: 'All', icon: Bell },
    { id: 'alert', label: 'Alerts', icon: AlertCircle },
    { id: 'update', label: 'Updates', icon: CheckCircle2 },
    { id: 'system', label: 'System', icon: Info },
  ];

  const markAllRead = () => {
    dispatch({ type: 'MARK_ALL_NOTIFICATIONS_READ' });
    showToast('success', 'success', 'All notifications marked as read');
  };

  const clearAll = () => {
    dispatch({ type: 'CLEAR_NOTIFICATIONS' });
    showToast('info', 'info', 'Notification history cleared');
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-amber-400" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-rose-400" />;
      default: return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diff = now - then;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return then.toLocaleDateString();
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Notifications</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage and view your system alerts and updates.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            className="h-10 px-4 rounded-xl text-xs font-bold bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white"
            onClick={markAllRead}
            icon={<Check className="w-4 h-4" />}>
            Mark all read
          </Button>
          <Button 
            className="h-10 px-4 rounded-xl text-xs font-bold bg-zinc-900/50 text-rose-500/70 border-zinc-800 hover:bg-rose-500/10 hover:text-rose-500"
            onClick={clearAll}
            icon={<Trash2 className="w-4 h-4" />}>
            Clear history
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 p-1 bg-zinc-900 border border-zinc-800 rounded-2xl w-fit">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={cn(
              "flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-bold transition-all capitalize",
              activeTab === cat.id ? "bg-zinc-800 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"
            )}>
            <cat.icon className="w-3.5 h-3.5" />
            {cat.label}
          </button>
        ))}
      </div>

      <div className="bg-zinc-900 rounded-[2.5rem] border border-zinc-800 overflow-hidden shadow-2xl">
        {filteredNotifications.length === 0 ? (
          <div className="py-24 text-center">
            <div className="w-20 h-20 bg-zinc-950 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-zinc-800">
              <Bell className="w-10 h-10 text-zinc-800" />
            </div>
            <h3 className="text-lg font-bold text-white">All caught up!</h3>
            <p className="text-sm text-zinc-500 mt-1">No new notifications in this category.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/50">
            {filteredNotifications.map((n) => (
              <div 
                key={n.id} 
                className={cn(
                  "p-6 flex gap-6 hover:bg-zinc-950/50 transition-all cursor-pointer group relative",
                  !n.read && "bg-primary-500/5"
                )}
                onClick={() => dispatch({ type: 'MARK_NOTIFICATION_READ', payload: n.id })}>
                {!n.read && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500" />
                )}
                
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border border-zinc-800",
                  n.read ? "bg-zinc-950" : "bg-zinc-900 shadow-xl"
                )}>
                  {getIcon(n.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <h4 className={cn(
                        "text-sm font-bold transition-colors",
                        n.read ? "text-zinc-400" : "text-white group-hover:text-primary-400"
                      )}>{n.title}</h4>
                      <span className="px-2 py-0.5 rounded-lg bg-zinc-950 border border-zinc-800 text-[9px] font-bold text-zinc-500 uppercase">
                        {n.category || 'system'}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-zinc-600 whitespace-nowrap">
                      {getTimeAgo(n.timestamp)}
                    </span>
                  </div>
                  <p className={cn(
                    "text-sm mt-1 leading-relaxed",
                    n.read ? "text-zinc-500" : "text-zinc-300"
                  )}>{n.message}</p>
                </div>

                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
