import { useState, useMemo } from 'react';
import {
  Briefcase, Users, UserCheck, Plus,
  MapPin, Clock, Star, ChevronRight, Eye, Trash2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import StatCard from '../components/StatCard';
import { cn } from '../utils/cn';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { FormInput, FormSelect, FormTextarea, Button } from '../components/FormInput';
import type { JobPosting, Candidate } from '../types';

const stages: Candidate['stage'][] = ['applied', 'screening', 'interview', 'technical', 'hr_round', 'selected', 'onboarding'];

const stageLabels: Record<string, string> = {
  applied: 'Applied',
  screening: 'Screening',
  interview: 'Interview',
  technical: 'Technical',
  hr_round: 'HR Round',
  selected: 'Selected',
  rejected: 'Rejected',
  onboarding: 'Onboarding',
};

const stageColors: Record<string, string> = {
  applied: 'bg-gray-100 text-gray-700 border-gray-200',
  screening: 'bg-blue-50 text-blue-700 border-blue-200',
  interview: 'bg-violet-50 text-violet-700 border-violet-200',
  technical: 'bg-orange-50 text-orange-700 border-orange-200',
  hr_round: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  selected: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
  onboarding: 'bg-green-50 text-green-700 border-green-200',
};

export default function Recruitment() {
  const { state, dispatch, showToast } = useApp();
  const { jobPostings, candidates } = state;

  const [activeTab, setActiveTab] = useState<'jobs' | 'candidates' | 'pipeline'>('jobs');
  const [showJobModal, setShowJobModal] = useState(false);
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const [jobForm, setJobForm] = useState({
    title: '',
    department: 'Engineering',
    location: '',
    type: 'full_time' as JobPosting['type'],
    experience: '',
    description: '',
  });

  const stats = useMemo(() => ({
    openJobs: jobPostings.filter(j => j.status === 'open').length,
    totalApplicants: jobPostings.reduce((s, j) => s + j.applicants, 0),
    inPipeline: candidates.filter(c => !['rejected', 'onboarding'].includes(c.stage)).length,
    hired: candidates.filter(c => c.stage === 'onboarding').length,
  }), [jobPostings, candidates]);

  const handleCreateJob = () => {
    if (!jobForm.title.trim() || !jobForm.location.trim()) {
      showToast('error', 'Validation Error', 'Please fill in all required fields.');
      return;
    }

    const newJob: JobPosting = {
      id: `j${Date.now()}`,
      title: jobForm.title,
      department: jobForm.department,
      location: jobForm.location,
      type: jobForm.type,
      experience: jobForm.experience,
      applicants: 0,
      status: 'open',
      postedDate: new Date().toISOString().split('T')[0],
      description: jobForm.description,
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
      description: '',
    });
  };

  const handleMoveCandidate = (candidateId: string, newStage: Candidate['stage']) => {
    dispatch({ type: 'MOVE_CANDIDATE_STAGE', payload: { id: candidateId, stage: newStage } });
    const candidate = candidates.find(c => c.id === candidateId);
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
          timestamp: new Date().toISOString(),
        },
      });
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Open Positions" value={stats.openJobs} icon={Briefcase} color="blue" />
        <StatCard title="Total Applicants" value={stats.totalApplicants} change={8.5} icon={Users} color="purple" />
        <StatCard title="In Pipeline" value={stats.inPipeline} icon={Clock} color="orange" />
        <StatCard title="Hired This Month" value={stats.hired} change={50} icon={UserCheck} color="green" />
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-100">
        <div className="flex items-center justify-between px-5 pt-4 border-b border-gray-100">
          <div className="flex items-center gap-1">
            {(['jobs', 'candidates', 'pipeline'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'px-4 py-2.5 text-sm font-medium rounded-t-xl transition-colors border-b-2 -mb-px',
                  activeTab === tab
                    ? 'border-primary-600 text-primary-600 bg-primary-50/50'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                )}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <Button icon={<Plus className="w-4 h-4" />} onClick={() => setShowJobModal(true)} size="sm">
            Post Job
          </Button>
        </div>

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobPostings.map(job => (
              <div key={job.id} className="border border-gray-100 rounded-2xl p-5 hover:shadow-lg hover:shadow-gray-100/50 transition-all group">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      'text-[11px] font-semibold px-2.5 py-1 rounded-full',
                      job.status === 'open' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                    )}>
                      {job.status.toUpperCase()}
                    </span>
                    <button
                      onClick={() => { setSelectedJob(job); setShowDeleteConfirm(true); }}
                      className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-danger-600 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h4 className="text-sm font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">{job.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{job.department}</p>
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <MapPin className="w-3.5 h-3.5" /> {job.location}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3.5 h-3.5" /> {job.experience}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Users className="w-3.5 h-3.5" /> {job.applicants} applicants
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400">
                    Posted {new Date(job.postedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  <button className="text-xs font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">
                    View <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Candidates Tab */}
        {activeTab === 'candidates' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Candidate</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Position</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Stage</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Rating</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {candidates.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {c.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{c.name}</p>
                          <p className="text-xs text-gray-500">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 hidden sm:table-cell">{c.position}</td>
                    <td className="px-4 py-3">
                      <select
                        value={c.stage}
                        onChange={(e) => handleMoveCandidate(c.id, e.target.value as Candidate['stage'])}
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border-0 cursor-pointer ${stageColors[c.stage]}`}
                      >
                        {[...stages, 'rejected'].map(s => (
                          <option key={s} value={s}>{stageLabels[s]}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {c.rating > 0 ? (
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span className="text-sm font-medium text-gray-700">{c.rating}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => { setSelectedCandidate(c); setShowCandidateModal(true); }}
                        className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-primary-600 transition-colors ml-auto"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pipeline Tab */}
        {activeTab === 'pipeline' && (
          <div className="p-5">
            <div className="flex gap-4 overflow-x-auto pb-4">
              {stages.map(stage => {
                const stageCandidates = candidates.filter(c => c.stage === stage);
                return (
                  <div key={stage} className="min-w-[240px] flex-shrink-0">
                    <div className={cn('rounded-xl border p-3 mb-3', stageColors[stage])}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">{stageLabels[stage]}</span>
                        <span className="text-xs font-bold">{stageCandidates.length}</span>
                      </div>
                    </div>
                    <div className="space-y-2 min-h-[200px]">
                      {stageCandidates.map(c => (
                        <div
                          key={c.id}
                          className="bg-white border border-gray-100 rounded-xl p-3 hover:shadow-md transition-all cursor-pointer"
                          onClick={() => { setSelectedCandidate(c); setShowCandidateModal(true); }}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-[10px] font-bold">
                              {c.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-900">{c.name}</p>
                              <p className="text-[10px] text-gray-500">{c.position}</p>
                            </div>
                          </div>
                          {c.rating > 0 && (
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map(star => (
                                <Star
                                  key={star}
                                  className={cn(
                                    'w-3 h-3',
                                    star <= Math.floor(c.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'
                                  )}
                                />
                              ))}
                              <span className="text-[10px] text-gray-400 ml-1">{c.rating}</span>
                            </div>
                          )}
                          {stage !== 'onboarding' && stage !== 'selected' && (
                            <div className="flex gap-1 mt-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const nextStage = stages[stages.indexOf(stage) + 1];
                                  if (nextStage) handleMoveCandidate(c.id, nextStage);
                                }}
                                className="flex-1 text-[10px] font-medium py-1 px-2 rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors"
                              >
                                Advance →
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMoveCandidate(c.id, 'rejected');
                                }}
                                className="text-[10px] font-medium py-1 px-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                      {stageCandidates.length === 0 && (
                        <div className="text-center py-8 text-xs text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
                          No candidates
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Post Job Modal */}
      <Modal
        isOpen={showJobModal}
        onClose={handleCloseJobModal}
        title="Post New Job"
        subtitle="Create a new job opening"
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={handleCloseJobModal}>Cancel</Button>
            <Button onClick={handleCreateJob}>Post Job</Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormInput
            label="Job Title"
            value={jobForm.title}
            onChange={(v) => setJobForm({ ...jobForm, title: v })}
            placeholder="Senior Frontend Developer"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <FormSelect
              label="Department"
              value={jobForm.department}
              onChange={(v) => setJobForm({ ...jobForm, department: v })}
              options={['Engineering', 'Design', 'Product', 'Marketing', 'Sales', 'Finance', 'HR', 'Operations'].map(d => ({ value: d, label: d }))}
            />
            <FormSelect
              label="Job Type"
              value={jobForm.type}
              onChange={(v) => setJobForm({ ...jobForm, type: v as JobPosting['type'] })}
              options={[
                { value: 'full_time', label: 'Full Time' },
                { value: 'part_time', label: 'Part Time' },
                { value: 'contract', label: 'Contract' },
                { value: 'remote', label: 'Remote' },
              ]}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Location"
              value={jobForm.location}
              onChange={(v) => setJobForm({ ...jobForm, location: v })}
              placeholder="San Francisco, CA"
              required
            />
            <FormInput
              label="Experience Required"
              value={jobForm.experience}
              onChange={(v) => setJobForm({ ...jobForm, experience: v })}
              placeholder="3-5 years"
            />
          </div>
          <FormTextarea
            label="Job Description"
            value={jobForm.description}
            onChange={(v) => setJobForm({ ...jobForm, description: v })}
            placeholder="Describe the role, responsibilities, and requirements..."
            rows={4}
          />
        </div>
      </Modal>

      {/* Candidate Details Modal */}
      <Modal
        isOpen={showCandidateModal}
        onClose={() => { setShowCandidateModal(false); setSelectedCandidate(null); }}
        title="Candidate Details"
        size="lg"
        footer={
          <Button onClick={() => { setShowCandidateModal(false); setSelectedCandidate(null); }}>Close</Button>
        }
      >
        {selectedCandidate && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-xl font-bold">
                {selectedCandidate.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{selectedCandidate.name}</h3>
                <p className="text-sm text-gray-500">{selectedCandidate.position}</p>
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${stageColors[selectedCandidate.stage]}`}>
                  {stageLabels[selectedCandidate.stage]}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-gray-50">
                <p className="text-[11px] text-gray-400 font-medium uppercase">Email</p>
                <p className="text-sm font-medium text-gray-900 mt-0.5">{selectedCandidate.email}</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50">
                <p className="text-[11px] text-gray-400 font-medium uppercase">Phone</p>
                <p className="text-sm font-medium text-gray-900 mt-0.5">{selectedCandidate.phone}</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50">
                <p className="text-[11px] text-gray-400 font-medium uppercase">Applied Date</p>
                <p className="text-sm font-medium text-gray-900 mt-0.5">{new Date(selectedCandidate.appliedDate).toLocaleDateString()}</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50">
                <p className="text-[11px] text-gray-400 font-medium uppercase">Rating</p>
                <div className="flex items-center gap-1 mt-0.5">
                  {selectedCandidate.rating > 0 ? (
                    <>
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star
                          key={star}
                          className={cn(
                            'w-4 h-4',
                            star <= Math.floor(selectedCandidate.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'
                          )}
                        />
                      ))}
                      <span className="text-sm font-medium text-gray-700 ml-1">{selectedCandidate.rating}</span>
                    </>
                  ) : (
                    <span className="text-sm text-gray-400">Not rated yet</span>
                  )}
                </div>
              </div>
            </div>
            {selectedCandidate.stage !== 'onboarding' && selectedCandidate.stage !== 'rejected' && (
              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <Button
                  variant="primary"
                  onClick={() => {
                    const nextStage = stages[stages.indexOf(selectedCandidate.stage) + 1];
                    if (nextStage) {
                      handleMoveCandidate(selectedCandidate.id, nextStage);
                      setShowCandidateModal(false);
                      setSelectedCandidate(null);
                    }
                  }}
                  fullWidth
                >
                  Advance to {stageLabels[stages[stages.indexOf(selectedCandidate.stage) + 1] || 'next']}
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    handleMoveCandidate(selectedCandidate.id, 'rejected');
                    setShowCandidateModal(false);
                    setSelectedCandidate(null);
                  }}
                >
                  Reject
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Delete Job Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteJob}
        title="Delete Job Posting"
        message={`Are you sure you want to delete "${selectedJob?.title}"? This action cannot be undone.`}
        type="danger"
        confirmText="Delete"
      />
    </div>
  );
}
