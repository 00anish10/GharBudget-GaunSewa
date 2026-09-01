import React, { forwardRef, useState } from 'react';

export interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
}

export const Switch = forwardRef<
  HTMLInputElement,
  SwitchProps
>(({ checked: checkedProp, onCheckedChange, className, ...props }, ref) => {
  const [checked, setChecked] = useState<boolean>(checkedProp !== false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.type === 'checkbox' ? e.target.checked : !checked;
    setChecked(newChecked);
    onCheckedChange?.(newChecked);
  };

  return (
    <div className="relative inline-flex items-center">
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        className="peer w-4 h-4 shrink-0 cursor-pointer rounded bg-slate-200 peer-data-[checked=true]:bg-[#005B48] peer-data-[checked=true]:after:translate-x-2 peer-data-[checked=true]:after:bg-white"
      />
      <span className="absolute left-1 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-slate-200 transition-colors peer-data-[checked=true]:bg-[#005B48]"></span>
    </div>
  );
});