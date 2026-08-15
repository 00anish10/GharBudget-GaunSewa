import React from 'react';
import {
  ShoppingCart,
  Home,
  Wallet,
  Zap,
  Plane,
  Shield,
  Bike,
  Laptop,
  GraduationCap,
  HeartPulse,
  Film,
  Tractor,
  Wrench,
  Truck,
  Hammer,
  HelpCircle,
} from 'lucide-react';

interface IconResolverProps {
  nameOrCategory: string;
  className?: string;
}

export const IconResolver: React.FC<IconResolverProps> = ({ nameOrCategory, className = 'w-5 h-5' }) => {
  const normalized = nameOrCategory.toLowerCase();

  if (normalized.includes('grocer') || normalized.includes('market') || normalized.includes('bhat')) {
    return <ShoppingCart className={className} />;
  }
  if (normalized.includes('rent') || normalized.includes('house') || normalized.includes('home')) {
    return <Home className={className} />;
  }
  if (normalized.includes('salary') || normalized.includes('income') || normalized.includes('deposit') || normalized.includes('wallet')) {
    return <Wallet className={className} />;
  }
  if (normalized.includes('util') || normalized.includes('elect') || normalized.includes('nea') || normalized.includes('power') || normalized.includes('internet')) {
    return <Zap className={className} />;
  }
  if (normalized.includes('trip') || normalized.includes('dashain') || normalized.includes('plane') || normalized.includes('travel')) {
    return <Plane className={className} />;
  }
  if (normalized.includes('emergency') || normalized.includes('shield') || normalized.includes('safety')) {
    return <Shield className={className} />;
  }
  if (normalized.includes('scooter') || normalized.includes('bike') || normalized.includes('vehicle')) {
    return <Bike className={className} />;
  }
  if (normalized.includes('laptop') || normalized.includes('tech') || normalized.includes('computer')) {
    return <Laptop className={className} />;
  }
  if (normalized.includes('educat') || normalized.includes('school') || normalized.includes('college')) {
    return <GraduationCap className={className} />;
  }
  if (normalized.includes('health') || normalized.includes('medic')) {
    return <HeartPulse className={className} />;
  }
  if (normalized.includes('tractor') || normalized.includes('farm') || normalized.includes('harvest')) {
    return <Tractor className={className} />;
  }
  if (normalized.includes('construct') || normalized.includes('repair') || normalized.includes('wrench')) {
    return <Wrench className={className} />;
  }
  if (normalized.includes('logistics') || normalized.includes('truck') || normalized.includes('transport')) {
    return <Truck className={className} />;
  }
  if (normalized.includes('carpent') || normalized.includes('hammer') || normalized.includes('shed')) {
    return <Hammer className={className} />;
  }
  if (normalized.includes('entertain')) {
    return <Film className={className} />;
  }

  return <HelpCircle className={className} />;
};

export const getCategoryIconStyle = (category: string) => {
  const norm = category.toLowerCase();
  if (norm.includes('grocer')) {
    return { bg: 'bg-[#EBF3FB]', text: 'text-[#2563EB]' };
  }
  if (norm.includes('rent')) {
    return { bg: 'bg-[#FEECE6]', text: 'text-[#C2410C]' };
  }
  if (norm.includes('income') || norm.includes('salary')) {
    return { bg: 'bg-[#E6F7F0]', text: 'text-[#047857]' };
  }
  if (norm.includes('util') || norm.includes('elect')) {
    return { bg: 'bg-[#FEF3E7]', text: 'text-[#B45309]' };
  }
  if (norm.includes('plane') || norm.includes('travel') || norm.includes('dashain')) {
    return { bg: 'bg-[#EBF3FB]', text: 'text-[#2563EB]' };
  }
  if (norm.includes('emergency') || norm.includes('safety')) {
    return { bg: 'bg-[#EBF3FB]', text: 'text-[#0284C7]' };
  }
  if (norm.includes('scooter') || norm.includes('behind')) {
    return { bg: 'bg-[#FEE2E2]', text: 'text-[#DC2626]' };
  }
  if (norm.includes('laptop') || norm.includes('education')) {
    return { bg: 'bg-[#EFF6FF]', text: 'text-[#3B82F6]' };
  }
  return { bg: 'bg-slate-100', text: 'text-slate-600' };
};
