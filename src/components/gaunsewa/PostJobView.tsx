import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PlusCircle, MapPin, DollarSign, Calendar, Sparkles } from 'lucide-react';

export const PostJobView: React.FC = () => {
  const { postNewJob, currentUser } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Farming');
  const [budget, setBudget] = useState('');
  const [rateType, setRateType] = useState<'daily' | 'total'>('daily');
  const [location, setLocation] = useState('Chitwan');
  const [timeline, setTimeline] = useState('Needed Tomorrow');
  const [duration, setDuration] = useState('2-3 Days');
  const [description, setDescription] = useState('');
  const [contactPhone, setContactPhone] = useState('+977-9841234567');
  const [perksText, setPerksText] = useState('Lunch provided (Daal Bhat)\nTools provided');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numBudget = parseFloat(budget) || 1000;
    const formattedBudget =
      rateType === 'daily' ? `Rs. ${numBudget}/day` : `Rs. ${numBudget} total`;

    const perks = perksText
      .split('\n')
      .map((p) => p.trim())
      .filter(Boolean);

    postNewJob({
      title: title.trim() || 'Local Work Requirement',
      budget: formattedBudget,
      budgetNumeric: numBudget,
      rateType,
      location,
      distance: 'Within 5km',
      timeline,
      duration,
      tags: [category, timeline.includes('Tomorrow') ? 'Urgent' : 'Local'],
      postedBy: currentUser.name,
      posterRole: 'Community Employer',
      posterAvatar: currentUser.avatarUrl,
      description,
      perks,
      contactPhone,
    });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-[#E2EAE5] shadow-sm space-y-6 animate-in fade-in-50">
      <div>
        <div className="flex items-center gap-2 text-[#005B48] mb-1">
          <PlusCircle className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">GaunSewa Community</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Post a Local Job or Task
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Reach skilled workers, farm hands, mechanics, and drivers in your village.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Job Title *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Rice Harvesting Help, Tractor Driver Needed"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#005B48] focus:bg-white"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#005B48]"
            >
              <option value="Farming">Farming & Agriculture</option>
              <option value="Construction">Construction & Masonry</option>
              <option value="Logistics">Transport & Logistics</option>
              <option value="Carpentry">Carpentry & Woodwork</option>
              <option value="Electrician">Electrical & Solar</option>
              <option value="Homecare">Animal & House Care</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Location / Municipality *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Chitwan, Bharatpur-10, Ratnanagar"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#005B48]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Payment Rate (Rs.) *
            </label>
            <input
              type="number"
              required
              placeholder="e.g. 800"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#005B48]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Rate Type
            </label>
            <select
              value={rateType}
              onChange={(e) => setRateType(e.target.value as 'daily' | 'total')}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#005B48]"
            >
              <option value="daily">Per Day (Daily Rate)</option>
              <option value="total">Total Fixed Price</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Duration
            </label>
            <input
              type="text"
              placeholder="e.g. 2-3 Days, 1 Day"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#005B48]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Timeline / Urgency
            </label>
            <input
              type="text"
              placeholder="e.g. Needed Tomorrow, Starts Monday"
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#005B48]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Direct Contact Phone *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. +977-9841234567"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#005B48]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Detailed Description *
          </label>
          <textarea
            required
            rows={3}
            placeholder="Describe tasks, required experience, work hours (e.g. 7 AM to 4 PM)..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-[#005B48]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Perks / Inclusions (One per line)
          </label>
          <textarea
            rows={2}
            placeholder="Lunch included (Daal Bhat)&#10;Tools provided&#10;Tea/Snacks"
            value={perksText}
            onChange={(e) => setPerksText(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-[#005B48]"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-[#005B48] hover:bg-[#004A3A] text-white text-xs sm:text-sm font-bold shadow-md transition-all mt-4"
        >
          Publish Job to Community
        </button>
      </form>
    </div>
  );
};
