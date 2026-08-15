import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckSquare, Clock, MapPin, Briefcase, CheckCircle2, Phone } from 'lucide-react';

export const MyStatusView: React.FC = () => {
  const { jobs, setActiveGSView, setSelectedJobId, currentUser } = useApp();

  const appliedJobs = jobs.filter((j) => j.applied);
  const myPostings = jobs.filter((j) => j.postedBy === currentUser.name);

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          My Status & Applications
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Track work you've applied to and tasks you have posted in your community.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Applied Jobs Section */}
        <div className="bg-white rounded-3xl p-6 border border-[#E2EAE5] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Applied Jobs ({appliedJobs.length})</span>
            </h2>
            <span className="text-xs text-slate-400">Active Applications</span>
          </div>

          {appliedJobs.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs border border-dashed rounded-2xl border-slate-200">
              You haven't applied to any jobs yet.{' '}
              <button
                onClick={() => setActiveGSView('jobs')}
                className="text-[#005B48] font-bold underline"
              >
                Browse Job Board
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {appliedJobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => {
                    setSelectedJobId(job.id);
                    setActiveGSView('jobs');
                  }}
                  className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/70 hover:border-[#005B48] transition-all cursor-pointer space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{job.title}</span>
                    <span className="text-xs font-bold text-[#005B48]">{job.budget}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>
                      {job.location} • {job.duration}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Under Review
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Job Postings Section */}
        <div className="bg-white rounded-3xl p-6 border border-[#E2EAE5] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#005B48]" />
              <span>Jobs You've Posted ({myPostings.length})</span>
            </h2>
            <button
              onClick={() => setActiveGSView('post-job')}
              className="text-xs font-bold text-[#005B48] hover:underline"
            >
              + Post New
            </button>
          </div>

          {myPostings.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs border border-dashed rounded-2xl border-slate-200">
              You haven't posted any jobs under this profile.
            </div>
          ) : (
            <div className="space-y-3">
              {myPostings.map((job) => (
                <div
                  key={job.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{job.title}</span>
                    <span className="text-xs font-bold text-slate-700">{job.budget}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{job.timeline}</span>
                    <span className="text-emerald-700 font-semibold">Active & Visible</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
