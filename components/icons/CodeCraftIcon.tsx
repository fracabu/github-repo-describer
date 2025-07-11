import React from 'react';

interface IconProps {
  className?: string;
}

export const CodeCraftIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M38 25L20 50L38 75" 
      stroke="#4A5568"
      strokeWidth="10" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <path 
      d="M62 25L80 50L62 75" 
      stroke="#4A5568"
      strokeWidth="10" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <path 
      d="M52,95 C40,75 42,45 55,5 C56,40 58,70 52,95 Z" 
      fill="#38BDF8"
    />
  </svg>
);