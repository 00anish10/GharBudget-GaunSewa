import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { JobListing } from '../../types';
import {
  Search,
  MapPin,
  Clock,
  Phone,
  CheckCircle,
  Briefcase,
  Calendar,
  DollarSign,
  Share2,
  Navigation,
  Check,
} from 'lucide-react';
import { motion } from 'motion/react';

interface GaunSewaJobsProps {
  onOpenPostJob: () => void;
}

export const GaunSewaJobs: React.FC<GaunSewaJobsProps> = ({ onOpenPostJob }) => {
  const {
    jobs,
    selectedJobId,
    setSelectedJobId,
    searchQuery,
    setSearchQuery,
    selectedJobCategory,
    setSelectedJobCategory,
    applyToJob,
    showToast,
  } = useApp();

  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [showCallModal, setShowCallModal] = useState<boolean>(false);

  // Filter jobs
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      searchQuery === '' ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      !selectedJobCategory ||
      job.tags.some(
        (t) =>
          t.toLowerCase().includes(selectedJobCategory.toLowerCase()) ||
          selectedJobCategory.toLowerCase().includes(t.toLowerCase())
      );

    const matchesLocation =
      selectedLocation === 'All' || job.location.includes(selectedLocation);

    return matchesSearch && matchesCategory && matchesLocation;
  });

  const selectedJob =
    jobs.find((j) => j.id === selectedJobId) || filteredJobs[0] || jobs[0];

  const handleApply = (jobId: string) => {
    applyToJob(jobId);
  };

  const handleCall = () => {
    setShowCallModal(true);
  };

  return (
    <div className="space-y-5 animate-in fade-in-50 duration-300">
      {/* Top Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E2EAE5] shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search jobs by skill, location, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#005B48] focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#005B48]"
            >
              <option value="All">All Locations</option>
              <option value="Chitwan">Chitwan</option>
              <option value="Bharatpur">Bharatpur</option>
              <option value="Ratnanagar">Ratnanagar</option>
              <option value="Narayangarh">Narayangarh</option>
            </select>

            <button
              onClick={onOpenPostJob}
              className="px-4 py-2 rounded-xl bg-[#005B48] hover:bg-[#004A3A] text-white text-xs font-bold transition-all shrink-0"
            >
              + Post Job
            </button>
          </div>
        </div>

        {/* Category Pills + Result count */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-slate-100">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setSelectedJobCategory(null)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                !selectedJobCategory
                  ? 'bg-[#005B48] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Skills
            </button>
            {['Farming', 'Construction', 'Logistics', 'Carpentry', 'Electrician'].map((skill) => (
              <button
                key={skill}
                onClick={() => setSelectedJobCategory(skill)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  selectedJobCategory === skill
                    ? 'bg-[#005B48] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>

          <span className="text-xs font-bold text-slate-400">
            {filteredJobs.length} Jobs Found
          </span>
        </div>
      </div>

      {/* Main Split Layout: Left List, Right Detail (Image 12 exact match) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 5 Cols: Job List Cards */}
        <div className="lg:col-span-5 space-y-3.5 max-h-[750px] overflow-y-auto pr-1">
          {filteredJobs.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center text-slate-400 border border-slate-200">
              No jobs found. Try adjusting your search or filters.
            </div>
          ) : (
            filteredJobs.map((job) => {
              const isSelected = selectedJob?.id === job.id;

              return (
                <motion.div
                  key={job.id}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => setSelectedJobId(job.id)}
                  className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'border-[#005B48] ring-2 ring-[#005B48]/15 shadow-md bg-emerald-50/20'
                      : 'border-[#E2EAE5] shadow-xs hover:border-slate-300'
                  }`}
                >
                  {/* Top line: Timeline tag + Budget */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-[#9C3E0E] border border-amber-200/60">
                      {job.timeline}
                    </span>
                    <span className="text-sm font-extrabold text-[#005B48] whitespace-nowrap">
                      {job.budget}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-slate-900 tracking-tight leading-tight">
                    {job.title}
                  </h3>

                  {/* Location & Distance */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {job.location} • {job.distance}
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                    {job.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600"
                      >
                        {t}
                      </span>
                    ))}
                    {job.applied && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Applied
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Right 7 Cols: Selected Job Details & Action Panel */}
        {selectedJob && (
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-[#E2EAE5] shadow-sm space-y-6 sticky top-20">
            {/* Map Route Card (Visual preview matching Image 12) */}
            <div className="relative h-44 sm:h-48 rounded-2xl overflow-hidden bg-slate-800 border border-slate-700/60 shadow-inner">
              {/* Stylized vector map pattern */}
              <div className="absolute inset-0 opacity-70 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] bg-slate-900" />
              
              {/* Route lines visualizer */}
              <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M 50 130 Q 150 50, 260 90 T 400 40"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeDasharray="6 4"
                  className="animate-pulse"
                />
                {/* User location pin */}
                <circle cx="50" cy="130" r="7" fill="#3B82F6" stroke="#fff" strokeWidth="2" />
                {/* Destination pin */}
                <circle cx="260" cy="90" r="9" fill="#005B48" stroke="#fff" strokeWidth="2" />
              </svg>

              {/* Map Badge */}
              <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-white text-xs flex items-center gap-2">
                <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold">{selectedJob.location}</span>
                <span className="text-slate-400">({selectedJob.distance})</span>
              </div>

              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-800">
                Nepal GPS Verified
              </div>
            </div>

            {/* Header: Title + Poster */}
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    {selectedJob.title}
                  </h2>
                  <div className="flex items-center gap-2.5 mt-2">
                    <img
                      src={selectedJob.posterAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
                      alt={selectedJob.postedBy}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block leading-tight">
                        Posted by {selectedJob.postedBy}
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        {selectedJob.posterRole || 'Local Employer'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xl sm:text-2xl font-extrabold text-[#005B48] block">
                    {selectedJob.budget}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 block mt-0.5">
                    {selectedJob.duration}
                  </span>
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Description (Matching Image 12 exact text) */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Job Description & Details
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                {selectedJob.description}
              </p>
            </div>

            {/* Perks / Inclusions */}
            {selectedJob.perks && selectedJob.perks.length > 0 && (
              <div className="bg-[#F8FAF9] rounded-2xl p-4 border border-[#E2EAE5] space-y-2">
                <h4 className="text-xs font-bold text-slate-800">Included & Provided:</h4>
                <div className="space-y-1.5 text-xs text-slate-600">
                  {selectedJob.perks.map((p, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-[#005B48] shrink-0" />
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons: Call & Apply Now (Image 12 exact match) */}
            <div className="flex items-center gap-3 pt-2">
              <button
                id="btn-call-employer"
                onClick={handleCall}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white border border-[#005B48] text-[#005B48] text-xs sm:text-sm font-bold hover:bg-emerald-50 transition-all shadow-2xs"
              >
                <Phone className="w-4 h-4" />
                <span>Call Employer</span>
              </button>

              <button
                id="btn-apply-job"
                onClick={() => handleApply(selectedJob.id)}
                disabled={selectedJob.applied}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md ${
                  selectedJob.applied
                    ? 'bg-emerald-700 text-white cursor-default'
                    : 'bg-[#005B48] hover:bg-[#004A3A] text-white active:scale-[0.99]'
                }`}
              >
                {selectedJob.applied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Application Sent</span>
                  </>
                ) : (
                  <>
                    <Briefcase className="w-4 h-4" />
                    <span>Apply Now</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Call Dialer Modal */}
      {showCallModal && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={() => setShowCallModal(false)}
          />
          <div className="relative bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl z-10 text-center space-y-4 animate-in fade-in-50">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#005B48] flex items-center justify-center mx-auto">
              <Phone className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Call {selectedJob.postedBy}
              </h3>
              <p className="text-xs text-slate-500 mt-1">Direct Nepal mobile line</p>
              <p className="text-lg font-extrabold text-[#005B48] mt-2 tracking-wider">
                {selectedJob.contactPhone || '+977-9841234567'}
              </p>
            </div>
            <div className="flex gap-2">
              <a
                href={`tel:${selectedJob.contactPhone || '+9779841234567'}`}
                className="flex-1 py-2.5 rounded-xl bg-[#005B48] text-white text-xs font-bold hover:bg-[#004A3A]"
              >
                Dial Phone
              </a>
              <button
                onClick={() => setShowCallModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
