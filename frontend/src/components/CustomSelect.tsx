import React from 'react';

interface Option {
  value: string;
  label: React.ReactNode;
}

interface CustomSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
  rtl?: boolean;
  className?: string;
  placeholder?: string;
}

// Generic custom select with custom arrow and RTL/LTR support
const CustomSelect: React.FC<CustomSelectProps> = ({ value, onChange, options, rtl = false, className = '', placeholder, ...props }) => {
  // Filter out empty value options to hide them from dropdown
  const filteredOptions = options.filter(opt => opt.value !== '');
  
  return (
    <div className="relative w-full">
      <select
        value={value}
        onChange={onChange}
        dir={rtl ? 'rtl' : 'ltr'}
        className={`block w-full py-2 px-4 bg-white border border-gray-300 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 ${rtl ? 'pl-10 pr-4' : 'pr-10 pl-4'} ${className}`}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {filteredOptions.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <svg
        className={`pointer-events-none absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 ${rtl ? 'left-3' : 'right-3'}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
};

export default CustomSelect; 