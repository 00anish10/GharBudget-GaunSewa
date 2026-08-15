import React from 'react';
import { Category } from '../../types';

interface CategoryBadgeProps {
  category: Category | string;
  size?: 'sm' | 'md';
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-xs';

  let colorClasses = 'bg-slate-100 text-slate-700';

  switch (category) {
    case 'Groceries':
      colorClasses = 'bg-[#EBF3FB] text-[#2563EB] font-medium';
      break;
    case 'Rent':
      colorClasses = 'bg-[#FEECE6] text-[#C2410C] font-medium';
      break;
    case 'Income':
      colorClasses = 'bg-[#E6F7F0] text-[#047857] font-medium';
      break;
    case 'Utilities':
      colorClasses = 'bg-[#FEF3E7] text-[#B45309] font-medium';
      break;
    case 'Education':
      colorClasses = 'bg-[#F3E8FF] text-[#7E22CE] font-medium';
      break;
    case 'Travel':
      colorClasses = 'bg-[#EEF2FF] text-[#4338CA] font-medium';
      break;
    default:
      colorClasses = 'bg-slate-100 text-slate-700 font-medium';
  }

  return (
    <span className={`inline-flex items-center rounded-full tracking-wide ${sizeClasses} ${colorClasses}`}>
      {category}
    </span>
  );
};
