import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { serviceCategories } from '../../data/initialData';
import { IconResolver } from '../common/IconResolver';
import {
  Search,
  ArrowRight,
  ShieldCheck,
  Users,
  MapPin,
  Clock,
  Briefcase,
  Sparkles,
} from 'lucide-react';
import { motion } from 'motion/react';

export const GaunSewaHome: React.FC = () => {
  const {
    setActiveGSView,
    setSearchQuery,
    setSelectedJobCategory,
    jobs,
    setSelectedJobId,
  } = useApp();

  const [localSearch, setLocalSearch] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    setActiveGSView('jobs');
  };

  const handleCategoryClick = (catTitle: string) => {
    setSelectedJobCategory(catTitle);
    setActiveGSView('jobs');
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* Hero Banner (Image 14 exact design match) */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#004A3A] via-[#005B48] to-[#0A3D32] text-white shadow-lg p-6 sm:p-10">
        {/* Background Overlay Art / Lighting */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Community Work & Local Services</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
            Empowering Local Communities
          </h1>

          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed font-normal">
            Connect with local experts for farming, construction, logistics, and more.
            Reliable help is just a click away.
          </p>

          {/* Search Bar (Image 14 search input) */}
          <form onSubmit={handleSearchSubmit} className="pt-2">
            <div className="flex items-center bg-white rounded-2xl p-1.5 shadow-xl max-w-lg border border-white/20">
              <div className="pl-3 text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Search for local services or jobs..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full px-3 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#005B48] hover:bg-[#004A3A] text-white text-xs sm:text-sm font-bold transition-all shrink-0 shadow-xs"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Categories Grid (Image 14 exact cards: Farming, Construction, Logistics, etc.) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Popular Categories
          </h2>
          <button
            onClick={() => {
              setSelectedJobCategory(null);
              setActiveGSView('jobs');
            }}
            className="text-xs font-semibold text-[#005B48] hover:underline inline-flex items-center gap-1"
          >
            <span>Browse All ({jobs.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {serviceCategories.map((cat) => (
            <motion.div
              key={cat.id}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              onClick={() => handleCategoryClick(cat.title)}
              className="bg-white rounded-2xl p-5 border border-[#E2EAE5] shadow-xs hover:border-[#005B48]/40 hover:shadow-md transition-all cursor-pointer group flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#005B48] flex items-center justify-center shrink-0 group-hover:bg-[#005B48] group-hover:text-white transition-colors duration-200">
                <IconResolver nameOrCategory={cat.iconName} className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-800 text-sm group-hover:text-[#005B48] transition-colors">
                    {cat.title}
                  </h3>
                  <span className="text-[11px] font-semibold text-slate-400">
                    {cat.count} jobs
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1">{cat.subtitle}</p>
                <div className="mt-3 text-[11px] font-bold text-[#005B48] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Explore jobs</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Featured Urgent Opportunities */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Urgent Local Requirements
            </h2>
            <p className="text-xs text-slate-500">Verified community postings in Chitwan & Bharatpur</p>
          </div>
          <button
            onClick={() => setActiveGSView('jobs')}
            className="text-xs font-semibold text-[#005B48] hover:underline"
          >
            View Job Board
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.slice(0, 2).map((job) => (
            <div
              key={job.id}
              onClick={() => {
                setSelectedJobId(job.id);
                setActiveGSView('jobs');
              }}
              className="bg-white rounded-2xl p-5 border border-[#E2EAE5] shadow-xs hover:border-[#005B48] transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#9C3E0E] bg-orange-50 px-2.5 py-0.5 rounded-full">
                    {job.timeline}
                  </span>
                  <span className="text-sm font-extrabold text-[#005B48]">{job.budget}</span>
                </div>
                <h3 className="font-bold text-slate-800 text-base">{job.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2">{job.description}</p>
              </div>

              <div className="flex items-center justify-between pt-4 mt-3 border-t border-slate-100 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{job.location} ({job.distance})</span>
                </div>
                <span className="font-semibold text-[#005B48]">Details →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
