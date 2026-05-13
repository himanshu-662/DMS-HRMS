import { useState, useMemo } from 'react';
import {
  Target, Star,
  CheckCircle2, Clock } from
'lucide-react';
import { useApp } from '../context/AppContext';
import StatCard from '../components/StatCard';
import { cn } from '../utils/cn';
import Modal from '../components/Modal';
import { Button, FormSelect } from '../components/FormInput';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ratingDistribution = [
  { range: 'Excellent (4.5+)', count: 15, color: '#10B981' },
  { range: 'Good (4.0+)', count: 32, color: '#6366F1' },
  { range: 'Average (3.5+)', count: 28, color: '#F59E0B' },
  { range: 'Fair (3.0+)', count: 18, color: '#F97316' },
  { range: 'Needs Imp. (<3.0)', count: 7, color: '#EF4444' }
];

export default function Performance() {
  const { state, dispatch, showToast } = useApp();
  const { performanceReviews = [] } = state;

  const [activeTab, setActiveTab] = useState('reviews');
  const [selectedReview, setSelectedReview] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    employeeName: '',
    reviewer: '',
    reviewPeriod: 'Q4 2024',
    status: 'pending'
  });

  const stats = useMemo(() => ({
    completed: performanceReviews.filter((r) => r.status === 'completed').length,
    inProgress: performanceReviews.filter((r) => r.status === 'in_progress').length,
    pending: performanceReviews.filter((r) => r.status === 'pending').length,
    avgRating: performanceReviews.filter((r) => r.rating > 0).length > 0 ?
      (performanceReviews.filter((r) => r.rating > 0).reduce((s, r) => s + r.rating, 0) / performanceReviews.filter((r) => r.rating > 0).length).toFixed(1) :
      '0'
  }), [performanceReviews]);

  const allGoals = useMemo(() => {
    return performanceReviews.flatMap((r) => r.goals.map((g) => ({ ...g, employeeName: r.employeeName, reviewId: r.id })));
  }, [performanceReviews]);

  const review = selectedReview ? performanceReviews.find((r) => r.id === selectedReview) : null;

  const handleUpdateProgress = (reviewId, goalId, progress) => {
    dispatch({ type: 'UPDATE_GOAL_PROGRESS', payload: { reviewId, goalId, progress } });
    if (progress === 100) {
      showToast('success', 'Goal Completed', 'The goal has been fully completed.');
    }
  };

  const handleAddReview = () => {
    if (!formData.employeeName || !formData.reviewer) {
      showToast('error', 'Error', 'Please select both employee and reviewer.');
      return;
    }
    dispatch({ type: 'ADD_REVIEW', payload: { ...formData, goals: [], rating: 0, id: Date.now().toString() } });
    showToast('success', 'Review Created', `Performance review cycle started for ${formData.employeeName}`);
    setShowAddModal(false);
    setFormData({ employeeName: '', reviewer: '', reviewPeriod: 'Q4 2024', status: 'pending' });
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Performance</h1>
          <p className="text-sm text-zinc-500 mt-1">Track employee performance and growth goals.</p>
        </div>
        <Button 
          className="bg-primary-600 hover:bg-primary-500 text-xs font-bold px-6 h-11"
          onClick={() => setShowAddModal(true)}>
          New Review
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Average Rating', value: stats.avgRating, icon: Star, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', sub: '/ 5.0' },
          { label: 'Completed Reviews', value: stats.completed, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
          { label: 'In Progress', value: stats.inProgress, icon: Clock, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
          { label: 'Pending Reviews', value: stats.pending, icon: Target, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' }
        ].map((stat) => (
          <div key={stat.label} className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 flex flex-col">
            <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.border} border flex items-center justify-center mb-4`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className="flex items-baseline gap-1">
              <p className="text-2xl font-bold text-white tracking-tight">{stat.value}</p>
              {stat.sub && <span className="text-[10px] font-bold text-zinc-600 ml-1">{stat.sub}</span>}
            </div>
            <p className="text-xs font-medium text-zinc-500 mt-1 uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Distribution Chart */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-8">Rating Distribution</h3>
          <div className="h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ratingDistribution} layout="vertical" margin={{ left: 0, right: 20 }}>
                <CartesianGrid strokeDasharray="0" stroke="none" horizontal={false} vertical={false} />
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="range" tick={{ fontSize: 9, fontWeight: 700, fill: '#71717a' }} axisLine={false} tickLine={false} width={100} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                  contentStyle={{ backgroundColor: '#09090b', borderRadius: '0.75rem', border: '1px solid #27272a', padding: '0.75rem' }} 
                  itemStyle={{ color: '#fff', fontSize: '10px', fontWeight: '700' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="lg:col-span-2 bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden flex flex-col">
          <div className="flex items-center px-6 border-b border-zinc-800">
            {['reviews', 'goals'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'px-6 py-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 -mb-px',
                  activeTab === tab ? 'border-primary-500 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'
                )}>
                {tab === 'reviews' ? 'Recent Reviews' : 'Active Goals'}
              </button>
            ))}
          </div>

          <div className="flex-1 min-h-[400px] overflow-y-auto">
            {activeTab === 'reviews' && (
              <div className="divide-y divide-zinc-800">
                {performanceReviews.map((review) => (
                  <div
                    key={review.id}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-zinc-800/30 transition-all cursor-pointer group"
                    onClick={() => setSelectedReview(review.id)}>
                    
                    <div className="w-10 h-10 rounded-xl bg-primary-600/10 border border-primary-500/20 flex items-center justify-center text-primary-400 text-xs font-bold">
                      {review.employeeName.split(' ').map((n) => n[0]).join('')}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white group-hover:text-primary-400 transition-colors">{review.employeeName}</p>
                      <p className="text-[10px] text-zinc-500 font-medium uppercase mt-1">{review.reviewPeriod} · Reviewer: {review.reviewer}</p>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      {review.rating > 0 ? (
                        <div className="flex items-center gap-1.5">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          <span className="text-sm font-bold text-white">{review.rating}</span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-zinc-700 font-bold uppercase italic">Not Rated</span>
                      )}
                      
                      <span className={cn(
                        'text-[9px] font-bold px-2 py-1 rounded border uppercase tracking-wider',
                        review.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        review.status === 'in_progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      )}>
                        {review.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'goals' && (
              <div className="p-6 space-y-6">
                {allGoals.map((goal) => (
                  <div key={goal.id} className="bg-zinc-950/50 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-all group">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-sm font-bold text-white group-hover:text-primary-400 transition-colors">{goal.title}</h4>
                        <p className="text-xs text-zinc-500 mt-1">{goal.description}</p>
                        <p className="text-[10px] text-primary-400 font-bold uppercase mt-3 flex items-center gap-2">
                          <Target className="w-3.5 h-3.5" /> Employee: {goal.employeeName}
                        </p>
                      </div>
                      <span className={cn(
                        'text-[9px] font-bold px-2 py-1 rounded border uppercase tracking-wider ml-4',
                        goal.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        goal.status === 'in_progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        'bg-zinc-800 text-zinc-500 border-zinc-700'
                      )}>
                        {goal.status.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Progress</span>
                        <span className="text-xs font-bold text-white">{goal.progress}%</span>
                      </div>
                      <div className="relative h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "absolute inset-y-0 left-0 transition-all duration-500",
                            goal.progress === 100 ? "bg-emerald-500" : "bg-primary-500"
                          )}
                          style={{ width: `${goal.progress}%` }} />
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={goal.progress}
                          onChange={(e) => handleUpdateProgress(goal.reviewId, goal.id, parseInt(e.target.value))}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      </div>
                      
                      <div className="flex items-center justify-between pt-1">
                        <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-wider">
                          Due: {new Date(goal.dueDate).toLocaleDateString()}
                        </p>
                        {goal.progress === 100 && (
                          <span className="flex items-center gap-1.5 text-[9px] font-bold text-emerald-500 uppercase tracking-wider">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={!!review}
        onClose={() => setSelectedReview(null)}
        title="Performance Review"
        subtitle={`Period: ${review?.reviewPeriod}`}
        size="lg"
        footer={
          <Button className="bg-zinc-800 px-8 text-xs font-bold h-11" onClick={() => setSelectedReview(null)}>Close Review</Button>
        }>
        
        {review && (
          <div className="space-y-8">
            <div className="flex items-center gap-5 p-6 bg-zinc-950 rounded-2xl border border-zinc-800">
              <div className="w-16 h-16 rounded-xl bg-primary-600 flex items-center justify-center text-white text-xl font-bold">
                {review.employeeName.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{review.employeeName}</h3>
                <p className="text-xs text-zinc-500 font-medium uppercase mt-1">Reviewer: {review.reviewer}</p>
                {review.rating > 0 && (
                  <div className="flex items-center gap-1.5 mt-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          'w-4 h-4',
                          star <= Math.floor(review.rating) ? 'text-amber-500 fill-amber-500' : 'text-zinc-800'
                        )} />
                    ))}
                    <span className="text-sm font-bold text-white ml-1.5">{review.rating}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Goals ({review.goals.length})</h4>
              </div>
              <div className="space-y-4">
                {review.goals.map((goal) => (
                  <div key={goal.id} className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm font-bold text-white">{goal.title}</p>
                      </div>
                      <span className={cn(
                        'text-[9px] font-bold px-2 py-1 rounded border uppercase tracking-wider',
                        goal.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        goal.status === 'in_progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        'bg-zinc-800 text-zinc-500 border-zinc-700'
                      )}>
                        {goal.progress}% Completed
                      </span>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={cn(
                          'h-1.5 rounded-full transition-all duration-700',
                          goal.progress === 100 ? 'bg-emerald-500' : 'bg-primary-500'
                        )}
                        style={{ width: `${goal.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
      
      {/* Add Review Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Start New Review Cycle"
        footer={
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button className="bg-primary-600 px-6" onClick={handleAddReview}>Start Review</Button>
          </div>
        }>
        <div className="space-y-6">
          <FormSelect 
            label="Select Employee" 
            value={formData.employeeName} 
            onChange={(v) => setFormData({...formData, employeeName: v})}
            options={[
              { value: '', label: 'Choose employee...' },
              ...state.employees.map(e => ({ value: e.name, label: e.name.toUpperCase() }))
            ]}
          />
          <FormSelect 
            label="Assign Reviewer (Manager)" 
            value={formData.reviewer} 
            onChange={(v) => setFormData({...formData, reviewer: v})}
            options={[
              { value: '', label: 'Choose reviewer...' },
              ...state.employees.map(e => ({ value: e.name, label: e.name.toUpperCase() }))
            ]}
          />
          <FormSelect 
            label="Review Period" 
            value={formData.reviewPeriod} 
            onChange={(v) => setFormData({...formData, reviewPeriod: v})}
            options={[
              { value: 'Q1 2024', label: 'Q1 2024' },
              { value: 'Q2 2024', label: 'Q2 2024' },
              { value: 'Q3 2024', label: 'Q3 2024' },
              { value: 'Q4 2024', label: 'Q4 2024' }
            ]}
          />
        </div>
      </Modal>
    </div>
  );
}


