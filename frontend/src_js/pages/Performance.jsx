import { useState, useMemo } from 'react';
import { Target, Star, CheckCircle2, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import StatCard from '../components/StatCard';
import { cn } from '../utils/cn';
import Modal from '../components/Modal';
import { Button } from '../components/FormInput';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
const ratingDistribution = [
    { range: '4.5-5.0', count: 15, color: '#10B981' },
    { range: '4.0-4.4', count: 32, color: '#6366F1' },
    { range: '3.5-3.9', count: 28, color: '#F59E0B' },
    { range: '3.0-3.4', count: 18, color: '#F97316' },
    { range: 'Below 3', count: 7, color: '#EF4444' },
];
export default function Performance() {
    const { state, dispatch, showToast } = useApp();
    const { performanceReviews } = state;
    const [activeTab, setActiveTab] = useState('reviews');
    const [selectedReview, setSelectedReview] = useState(null);
    const stats = useMemo(() => ({
        completed: performanceReviews.filter(r => r.status === 'completed').length,
        inProgress: performanceReviews.filter(r => r.status === 'in_progress').length,
        pending: performanceReviews.filter(r => r.status === 'pending').length,
        avgRating: performanceReviews.filter(r => r.rating > 0).length > 0
            ? (performanceReviews.filter(r => r.rating > 0).reduce((s, r) => s + r.rating, 0) / performanceReviews.filter(r => r.rating > 0).length).toFixed(1)
            : '0',
    }), [performanceReviews]);
    const allGoals = useMemo(() => {
        return performanceReviews.flatMap(r => r.goals.map(g => ({ ...g, employeeName: r.employeeName, reviewId: r.id })));
    }, [performanceReviews]);
    const review = selectedReview ? performanceReviews.find(r => r.id === selectedReview) : null;
    const handleUpdateProgress = (reviewId, goalId, progress) => {
        dispatch({ type: 'UPDATE_GOAL_PROGRESS', payload: { reviewId, goalId, progress } });
        if (progress === 100) {
            showToast('success', 'Goal Completed', 'Congratulations on completing this goal!');
        }
    };
    return (<div className="space-y-5 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Avg Rating" value={stats.avgRating} icon={Star} color="orange" subtitle="Out of 5.0"/>
        <StatCard title="Reviews Completed" value={stats.completed} icon={CheckCircle2} color="green"/>
        <StatCard title="In Progress" value={stats.inProgress} icon={Clock} color="blue"/>
        <StatCard title="Pending" value={stats.pending} icon={Target} color="purple"/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rating Distribution */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Rating Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={ratingDistribution} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false}/>
              <XAxis type="number" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false}/>
              <YAxis type="category" dataKey="range" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} width={65}/>
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb' }}/>
              <Bar dataKey="count" fill="#6366F1" radius={[0, 6, 6, 0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Reviews & Goals */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100">
          <div className="flex items-center px-5 pt-4 border-b border-gray-100">
            {['reviews', 'goals'].map(tab => (<button key={tab} onClick={() => setActiveTab(tab)} className={cn('px-4 py-2.5 text-sm font-medium rounded-t-xl transition-colors border-b-2 -mb-px', activeTab === tab
                ? 'border-primary-600 text-primary-600 bg-primary-50/50'
                : 'border-transparent text-gray-500 hover:text-gray-700')}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>))}
          </div>

          {activeTab === 'reviews' && (<div className="divide-y divide-gray-50">
              {performanceReviews.map(review => (<div key={review.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/50 transition-colors cursor-pointer" onClick={() => setSelectedReview(review.id)}>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {review.employeeName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{review.employeeName}</p>
                    <p className="text-xs text-gray-500">{review.reviewPeriod} · Reviewer: {review.reviewer}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {review.rating > 0 ? (<div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 rounded-xl">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500"/>
                        <span className="text-sm font-bold text-amber-700">{review.rating}</span>
                      </div>) : (<span className="text-xs text-gray-400">Not rated</span>)}
                    <span className={cn('text-[11px] font-semibold px-2.5 py-1 rounded-full', review.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                    review.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-amber-100 text-amber-700')}>
                      {review.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>))}
            </div>)}

          {activeTab === 'goals' && (<div className="p-5 space-y-4 max-h-[500px] overflow-y-auto">
              {allGoals.map(goal => (<div key={goal.id} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">{goal.title}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{goal.description}</p>
                      <p className="text-[10px] text-primary-600 font-medium mt-1">{goal.employeeName}</p>
                    </div>
                    <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ml-2', goal.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                    goal.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-600')}>
                      {goal.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-500">Progress</span>
                      <span className="font-semibold text-gray-700">{goal.progress}%</span>
                    </div>
                    <input type="range" min="0" max="100" value={goal.progress} onChange={(e) => handleUpdateProgress(goal.reviewId, goal.id, parseInt(e.target.value))} className="w-full h-2 bg-gray-100 rounded-full appearance-none cursor-pointer accent-primary-600"/>
                    <p className="text-[11px] text-gray-400 mt-1.5">
                      Due: {new Date(goal.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>))}
            </div>)}
        </div>
      </div>

      {/* Review Detail Modal */}
      <Modal isOpen={!!review} onClose={() => setSelectedReview(null)} title="Performance Review" subtitle={review?.reviewPeriod} size="lg" footer={<Button onClick={() => setSelectedReview(null)}>Close</Button>}>
        {review && (<div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xl font-bold">
                {review.employeeName.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{review.employeeName}</h3>
                <p className="text-sm text-gray-500">Reviewer: {review.reviewer}</p>
                {review.rating > 0 && (<div className="flex items-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map(star => (<Star key={star} className={cn('w-5 h-5', star <= Math.floor(review.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200')}/>))}
                    <span className="text-sm font-bold text-amber-700 ml-1">{review.rating}</span>
                  </div>)}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Goals ({review.goals.length})</h4>
              <div className="space-y-3">
                {review.goals.map(goal => (<div key={goal.id} className="p-3 rounded-xl bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-900">{goal.title}</p>
                      <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', goal.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                    goal.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-200 text-gray-600')}>
                        {goal.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className={cn('h-1.5 rounded-full transition-all', goal.progress === 100 ? 'bg-emerald-500' : 'bg-primary-500')} style={{ width: `${goal.progress}%` }}/>
                    </div>
                  </div>))}
              </div>
            </div>
          </div>)}
      </Modal>
    </div>);
}
