import React from 'react';

const CustomDropdown = ({ 
  value, 
  onChange, 
  options, 
  placeholder, 
  label,
  required = false,
  disabled = false,
  className = ''
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-slate-300">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700/50 
          text-slate-200 focus:outline-none focus:border-slate-600 focus:ring-1 
          focus:ring-slate-600 transition-colors duration-300 
          disabled:opacity-50 disabled:cursor-not-allowed
          appearance-none cursor-pointer
          [&>option]:bg-white [&>option]:text-black [&>option]:relative [&>option]:z-50
          ${className}`}
        >
          {placeholder && (
            <option value="" disabled className="bg-white !text-black relative z-50">
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              className="!bg-white !text-black relative z-50"
            >
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg 
            className="w-4 h-4 text-slate-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default CustomDropdown; 