import { useState, useMemo } from 'react';
import {
  Briefcase, Users, UserCheck, Plus,
  MapPin, Clock, Star, ChevronRight, Eye, Trash2 } from
'lucide-react';
import { useApp } from '../context/AppContext';
import StatCard from '../components/StatCard';
import { cn } from '../utils/cn';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { FormInput, FormSelect, FormTextarea, Button } from '../components/FormInput';


const stages = ['applied', 'screening', 'interview', 'technical', 'hr_round', 'selected', 'onboarding'];

const stageLabels = {
  applied: 'Applied',
  screening: 'Screening',
  interview: 'Interview',
  technical: 'Technical',
  hr_round: 'HR Round',
  selected: 'Selected',
  rejected: 'Rejected',
  onboarding: 'Onboarding'
};

const stageColors = {
  applied: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
  screening: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  interview: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  technical: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  hr_round: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  selected: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  rejected: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  onboarding: 'bg-primary-500/10 text-primary-400 border-primary-500/20'
};

export default function Recruitment() {
  const { state, dispatch, showToast } = useApp();
  const { jobPostings = [], candidates = [] } = state;

  const [activeTab, setActiveTab] = useState('jobs');
  const [showJobModal, setShowJobModal] = useState(false);
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [jobForm, setJobForm] = useState({
    title: '',
    department: 'Engineering',
    location: '',
    type: 'full_time',
    experience: '',
    description: ''
  });

  const stats = useMemo(() => ({
    openJobs: jobPostings.filter((j) => j.status === 'open').length,
    totalApplicants: jobPostings.reduce((s, j) => s + j.applicants, 0),
    inPipeline: candidates.filter((c) => !['rejected', 'onboarding'].includes(c.stage)).length,
    hired: candidates.filter((c) => c.stage === 'onboarding').length
  }), [jobPostings, candidates]);

  const handleCreateJob = () => {
    if (!jobForm.title.trim() || !jobForm.location.trim()) {
      showToast('error', 'Validation Error', 'Please fill in all required fields.');
      return;
    }

    const newJob = {
      id: `j${Date.now()}`,
      title: jobForm.title,
      department: jobForm.department,
      location: jobForm.location,
      type: jobForm.type,
      experience: jobForm.experience,
      applicants: 0,
      status: 'open',
      postedDate: new Date().toISOString().split('T')[0],
      description: jobForm.description
    };

    dispatch({ type: 'ADD_JOB', payload: newJob });
    showToast('success', 'Job Posted', `${jobForm.title} position has been posted.`);
    handleCloseJobModal();
  };

  const handleDeleteJob = () => {
    if (selectedJob) {
      dispatch({ type: 'DELETE_JOB', payload: selectedJob.id });
      showToast('success', 'Job Deleted', 'The job posting has been removed.');
      setSelectedJob(null);
    }
  };

  const handleCloseJobModal = () => {
    setShowJobModal(false);
    setJobForm({
      title: '',
      department: 'Engineering',
      location: '',
      type: 'full_time',
      experience: '',
      description: ''
    });
  };

  const handleMoveCandidate = (candidateId, newStage) => {
    dispatch({ type: 'MOVE_CANDIDATE_STAGE', payload: { id: candidateId, stage: newStage } });
    const candidate = candidates.find((c) => c.id === candidateId);
    showToast('success', 'Candidate Moved', `${candidate?.name} moved to ${stageLabels[newStage]}.`);

    if (newStage === 'selected') {
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: Date.now().toString(),
          title: 'Candidate Selected',
          message: `${candidate?.name} has been selected for ${candidate?.position}.`,
          type: 'success',
          read: false,
          timestamp: new Date().toISOString()
        }
      });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Recruitment</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage job openings and candidate pipelines.</p>
        </div>
        <Button className="bg-primary-600 hover:bg-primary-500 text-xs font-bold px-6 h-11 shadow-lg shadow-primary-900/20" icon={<Plus className="w-4 h-4" />} onClick={() => setShowJobModal(true)}>Post Job</Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Open Positions', value: stats.openJobs, icon: Briefcase, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
          { label: 'Total Applicants', value: stats.totalApplicants, icon: Users, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
          { label: 'In Pipeline', value: stats.inPipeline, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
          { label: 'Hired', value: stats.hired, icon: UserCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' }
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

      {/* Tabs */}
      <div className="space-y-6">
        <div className="bg-zinc-900 p-1 rounded-xl border border-zinc-800 inline-flex">
          {['jobs', 'candidates', 'pipeline'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all',
                activeTab === tab ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
              )}>
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'jobs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobPostings.map((job) => (
              <div key={job.id} className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8 hover:border-zinc-700 transition-all group">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary-600/10 border border-primary-500/20 flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-primary-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      'text-[10px] font-bold px-2 py-1 rounded-md border uppercase tracking-wider',
                      job.status === 'open' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                    )}>
                      {job.status}
                    </span>
                    <button
                      onClick={() => {setSelectedJob(job); setShowDeleteConfirm(true);}}
                      className="p-1.5 text-zinc-600 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <h4 className="text-lg font-bold text-white group-hover:text-primary-400 transition-colors">{job.title}</h4>
                <p className="text-xs text-zinc-500 mt-1 uppercase font-medium">{job.department}</p>
                
                <div className="mt-8 space-y-3">
                  <div className="flex items-center gap-3 text-xs text-zinc-400">
                    <MapPin className="w-4 h-4 text-zinc-600" /> {job.location}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-zinc-400">
                    <Clock className="w-4 h-4 text-zinc-600" /> {job.experience}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-primary-400 font-bold">
                    <Users className="w-4 h-4" /> {job.applicants} Applicants
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-zinc-800 flex items-center justify-between">
                  <span className="text-[10px] text-zinc-600 font-medium">
                    Posted {new Date(job.postedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  <button className="text-[10px] font-bold text-primary-500 uppercase tracking-widest flex items-center gap-2 hover:text-primary-400 transition-colors group/btn">
                    Details <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'candidates' && (
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-zinc-950/50 border-b border-zinc-800">
                    <th className="text-left px-6 py-5 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Candidate</th>
                    <th className="text-left px-6 py-5 text-[10px] font-bold text-zinc-500 uppercase tracking-wider hidden sm:table-cell">Position</th>
                    <th className="text-left px-6 py-5 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Stage</th>
                    <th className="text-left px-6 py-5 text-[10px] font-bold text-zinc-500 uppercase tracking-wider hidden md:table-cell">Rating</th>
                    <th className="text-right px-6 py-5 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {candidates.map((c) => (
                    <tr key={c.id} className="hover:bg-zinc-800/50 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-white text-[10px] font-bold">
                            {c.name.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white group-hover:text-primary-400 transition-colors">{c.name}</p>
                            <p className="text-[10px] text-zinc-500 mt-1">{c.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-[11px] font-medium text-zinc-400 uppercase hidden sm:table-cell">{c.position}</td>
                      <td className="px-6 py-5">
                        <select
                          value={c.stage}
                          onChange={(e) => handleMoveCandidate(c.id, e.target.value)}
                          className={cn(
                            "text-[10px] font-bold px-3 py-1.5 rounded-lg border uppercase tracking-wider cursor-pointer focus:outline-none transition-all",
                            stageColors[c.stage] || stageColors.applied
                          )}>
                          {[...stages, 'rejected'].map((s) => (
                            <option key={s} value={s} className="bg-zinc-950 text-white">{stageLabels[s].toUpperCase()}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-5 hidden md:table-cell">
                        {c.rating > 0 ? (
                          <div className="flex items-center gap-1.5">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            <span className="text-sm font-bold text-white">{c.rating}</span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-zinc-700 font-bold uppercase">Pending</span>
                        )}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button
                          onClick={() => {setSelectedCandidate(c); setShowCandidateModal(true);}}
                          className="p-2 text-zinc-500 hover:text-white transition-colors">
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'pipeline' && (
          <div className="flex gap-6 overflow-x-auto pb-8 custom-scrollbar">
            {stages.map((stage) => {
              const stageCandidates = candidates.filter((c) => c.stage === stage);
              return (
                <div key={stage} className="min-w-[300px] flex-shrink-0">
                  <div className={cn('rounded-xl border p-4 mb-4 flex items-center justify-between', stageColors[stage])}>
                    <span className="text-[10px] font-bold uppercase tracking-wider">{stageLabels[stage]}</span>
                    <span className="w-6 h-6 rounded-md bg-black/20 flex items-center justify-center text-[10px] font-bold">{stageCandidates.length}</span>
                  </div>
                  
                  <div className="space-y-4 min-h-[500px] p-2 bg-zinc-950/20 rounded-2xl border border-zinc-800/30">
                    {stageCandidates.map((c) => (
                      <div
                        key={c.id}
                        className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-600 transition-all cursor-pointer group"
                        onClick={() => {setSelectedCandidate(c); setShowCandidateModal(true);}}>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center text-white text-[10px] font-bold">
                            {c.name.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white group-hover:text-primary-400 transition-colors leading-none">{c.name}</p>
                            <p className="text-[10px] text-zinc-500 font-medium uppercase mt-1.5">{c.position}</p>
                          </div>
                        </div>
                        
                        {c.rating > 0 && (
                          <div className="flex items-center gap-1 mb-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={cn(
                                  'w-3 h-3',
                                  star <= Math.floor(c.rating) ? 'text-amber-500 fill-amber-500' : 'text-zinc-800'
                                )} />
                            ))}
                          </div>
                        )}
                        
                        {stage !== 'onboarding' && stage !== 'selected' && (
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const nextStage = stages[stages.indexOf(stage) + 1];
                                if (nextStage) handleMoveCandidate(c.id, nextStage);
                              }}
                              className="flex-1 text-[9px] font-bold py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all uppercase tracking-wider">
                              Move Forward
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMoveCandidate(c.id, 'rejected');
                              }}
                              className="text-[9px] font-bold py-2 px-3 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-700 hover:text-rose-500 hover:border-rose-500/30 transition-all uppercase tracking-wider">
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                    {stageCandidates.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-16 opacity-20">
                        <Users className="w-8 h-8 text-zinc-500 mb-2" />
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Empty</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Post Job Modal */}
      <Modal
        isOpen={showJobModal}
        onClose={handleCloseJobModal}
        title="Post New Job"
        subtitle="Create a new job opening for the team."
        size="lg"
        footer={
          <>
            <Button variant="ghost" className="px-6 text-xs font-bold" onClick={handleCloseJobModal}>Cancel</Button>
            <Button className="bg-primary-600 px-8 text-xs font-bold shadow-lg shadow-primary-900/20" onClick={handleCreateJob}>Post Job</Button>
          </>
        }>
        
        <div className="space-y-6">
          <FormInput
            label="Job Title"
            value={jobForm.title}
            onChange={(v) => setJobForm({ ...jobForm, title: v })}
            placeholder="e.g. Senior Software Engineer"
            required />
          
          <div className="grid grid-cols-2 gap-6">
            <FormSelect
              label="Department"
              value={jobForm.department}
              onChange={(v) => setJobForm({ ...jobForm, department: v })}
              options={['Engineering', 'Design', 'Product', 'Marketing', 'Sales', 'Finance', 'HR', 'Operations'].map((d) => ({ value: d, label: d }))} />
            
            <FormSelect
              label="Job Type"
              value={jobForm.type}
              onChange={(v) => setJobForm({ ...jobForm, type: v })}
              options={[
                { value: 'full_time', label: 'Full-time' },
                { value: 'part_time', label: 'Part-time' },
                { value: 'contract', label: 'Contract' },
                { value: 'remote', label: 'Remote' }
              ]} />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <FormInput
              label="Location"
              value={jobForm.location}
              onChange={(v) => setJobForm({ ...jobForm, location: v })}
              placeholder="e.g. Remote / New York"
              required />
            
            <FormInput
              label="Experience"
              value={jobForm.experience}
              onChange={(v) => setJobForm({ ...jobForm, experience: v })}
              placeholder="e.g. 5+ years" />
          </div>

          <FormTextarea
            label="Description"
            value={jobForm.description}
            onChange={(v) => setJobForm({ ...jobForm, description: v })}
            placeholder="Outline job responsibilities and requirements..."
            rows={4} />
        </div>
      </Modal>

      {/* Candidate Details Modal */}
      <Modal
        isOpen={showCandidateModal}
        onClose={() => {setShowCandidateModal(false); setSelectedCandidate(null);}}
        title="Candidate Profile"
        subtitle="Review candidate information and progress."
        size="lg"
        footer={
          <Button className="bg-zinc-800 px-8 text-xs font-bold" onClick={() => {setShowCandidateModal(false); setSelectedCandidate(null);}}>Close</Button>
        }>
        
        {selectedCandidate && (
          <div className="space-y-8">
            <div className="flex items-center gap-5 p-6 bg-zinc-950 rounded-2xl border border-zinc-800">
              <div className="w-16 h-16 rounded-xl bg-primary-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                {selectedCandidate.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{selectedCandidate.name}</h3>
                <p className="text-xs text-zinc-500 font-medium uppercase mt-1.5">{selectedCandidate.position}</p>
                <div className="mt-4">
                  <span className={cn("text-[10px] font-bold px-2.5 py-1 rounded-lg border uppercase tracking-wider", stageColors[selectedCandidate.stage] || stageColors.applied)}>
                    {stageLabels[selectedCandidate.stage]}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {[
                { label: 'Email', value: selectedCandidate.email },
                { label: 'Phone', value: selectedCandidate.phone },
                { label: 'Applied On', value: new Date(selectedCandidate.appliedDate).toLocaleDateString() },
                { label: 'Rating', value: selectedCandidate.rating, isRating: true }
              ].map((item) => (
                <div key={item.label} className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800">
                  <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider">{item.label}</p>
                  <div className="mt-2">
                    {item.isRating ? (
                      <div className="flex items-center gap-1.5">
                        {item.value > 0 ? (
                          <>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={cn(
                                  'w-4 h-4',
                                  star <= Math.floor(item.value) ? 'text-amber-500 fill-amber-500' : 'text-zinc-800'
                                )} />
                            ))}
                            <span className="text-sm font-bold text-white ml-1.5">{item.value}</span>
                          </>
                        ) : (
                          <span className="text-xs font-bold text-zinc-700 uppercase italic">Not rated</span>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm font-bold text-zinc-300">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {selectedCandidate.stage !== 'onboarding' && selectedCandidate.stage !== 'rejected' && (
              <div className="flex gap-4 pt-4">
                <Button
                  className="bg-primary-600 hover:bg-primary-500 text-xs font-bold h-12 flex-1 shadow-lg shadow-primary-900/20"
                  onClick={() => {
                    const nextStage = stages[stages.indexOf(selectedCandidate.stage) + 1];
                    if (nextStage) {
                      handleMoveCandidate(selectedCandidate.id, nextStage);
                      setShowCandidateModal(false);
                      setSelectedCandidate(null);
                    }
                  }}>
                  Move to {stageLabels[stages[stages.indexOf(selectedCandidate.stage) + 1] || 'next']}
                </Button>
                <Button
                  variant="danger"
                  className="h-12 flex-1 text-xs font-bold"
                  onClick={() => {
                    handleMoveCandidate(selectedCandidate.id, 'rejected');
                    setShowCandidateModal(false);
                    setSelectedCandidate(null);
                  }}>
                  Reject Application
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteJob}
        title="Remove Job Posting"
        message={`This will permanently delete the "${selectedJob?.title}" position. This action cannot be undone.`}
        type="danger"
        confirmText="Remove Posting" />
    </div>
  );
}

