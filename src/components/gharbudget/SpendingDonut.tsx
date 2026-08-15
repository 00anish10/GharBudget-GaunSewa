import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatNepaliNumber } from '../../utils/formatters';
import { motion } from 'motion/react';

export const SpendingDonut: React.FC = () => {
  const { totalSpent, spendingByCategory, currentUser } = useApp();
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // If no transactions yet, show default pleasant segments
  const displaySegments =
    spendingByCategory.length > 0
      ? spendingByCategory
      : [
          { category: 'Groceries', amount: 18120, percentage: 40, color: '#005B48' },
          { category: 'Rent', amount: 15855, percentage: 35, color: '#F59E0B' },
          { category: 'Utilities', amount: 6795, percentage: 15, color: '#9C3E0E' },
          { category: 'Other', amount: 4530, percentage: 10, color: '#94A3B8' },
        ];

  // SVG Donut calculation
  const size = 180;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let cumulativePercent = 0;

  const totalDisplaySpent = totalSpent > 0 ? totalSpent : 45300;
  const totalDisplayK =
    totalDisplaySpent >= 1000
      ? `${(totalDisplaySpent / 1000).toFixed(1).replace(/\.0$/, '')}K`
      : `${totalDisplaySpent}`;

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E2EAE5] shadow-xs flex flex-col justify-between h-full">
      <div>
        <h3 className="text-lg font-bold text-slate-800 tracking-tight mb-4">Spending</h3>
        
        {/* SVG Donut Chart */}
        <div className="relative flex items-center justify-center my-4">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
            {/* Background ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#F1F5F3"
              strokeWidth={strokeWidth}
            />

            {/* Slices */}
            {displaySegments.map((segment) => {
              const strokeDasharray = `${(segment.percentage * circumference) / 100} ${circumference}`;
              const strokeDashoffset = -((cumulativePercent * circumference) / 100);
              cumulativePercent += segment.percentage;

              const isHovered = hoveredCategory === segment.category;

              return (
                <circle
                  key={segment.category}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={segment.color}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="butt"
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredCategory(segment.category)}
                  onMouseLeave={() => setHoveredCategory(null)}
                />
              );
            })}
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            {hoveredCategory ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="px-2"
              >
                <span className="text-[11px] font-medium text-slate-500 block">{hoveredCategory}</span>
                <span className="text-sm font-bold text-slate-800 block">
                  {formatCurrency(
                    displaySegments.find((s) => s.category === hoveredCategory)?.amount || 0,
                    currentUser.currencyPreference
                  )}
                </span>
                <span className="text-[10px] font-semibold text-[#005B48]">
                  {displaySegments.find((s) => s.category === hoveredCategory)?.percentage}%
                </span>
              </motion.div>
            ) : (
              <div>
                <span className="text-xs font-normal text-slate-400 block mb-0.5">Total</span>
                <span className="text-2xl font-extrabold text-slate-800 tracking-tight">{totalDisplayK}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Legend list */}
      <div className="space-y-2.5 pt-2 border-t border-slate-100">
        {displaySegments.slice(0, 4).map((segment) => (
          <div
            key={segment.category}
            onMouseEnter={() => setHoveredCategory(segment.category)}
            onMouseLeave={() => setHoveredCategory(null)}
            className={`flex items-center justify-between text-xs py-1 px-1.5 rounded-lg transition-colors cursor-pointer ${
              hoveredCategory === segment.category ? 'bg-slate-50 font-semibold' : 'text-slate-600'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: segment.color }}
              />
              <span className="text-slate-700">{segment.category}</span>
            </div>
            <span className="font-semibold text-slate-900">{segment.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
