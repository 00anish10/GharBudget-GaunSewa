import React, { forwardRef, useState } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export const Select = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, ...props }, ref) => (
  <select ref={ref} className={className} {...props} />
));

export const Option = ({ value, label, children }: {
  value: string;
  label: string;
  children?: React.ReactNode;
}) => (
  <option value={value}>
    {label || children}
  </option>
);