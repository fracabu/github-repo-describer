
import React from 'react';

interface IconProps {
    className?: string;
}

export const SparklesIcon: React.FC<IconProps> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path 
        fillRule="evenodd" 
        d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 01.75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 019.75 22.5a.75.75 0 01-.75-.75v-7.19c-2.844.075-5.08.776-6.565 2.063a.75.75 0 01-1.06-1.06c1.559-1.56 3.655-2.285 5.86-2.336V7.584z" 
        clipRule="evenodd" 
    />
    <path d="M11.625 13.5a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008z" />
    <path d="M10.125 15a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75V15z" />
    <path d="M13.125 15a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75V15z" />
  </svg>
);
