/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

const CustomToggleGroup = ({
  options,
  value,
  onChange,
  multiple = false,
  className = "",
}: any) => {
  const handleToggle = (option: any) => {
    if (multiple) {
      const newValue = value.includes(option)
        ? value.filter((item: any) => item !== option)
        : [...value, option];
      onChange(newValue);
    } else {
      onChange(value === option ? "" : option);
    }
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {options.map((option: any) => (
        <button
          key={option}
          onClick={() => handleToggle(option)}
          className={`px-3 py-2 shadow-[inset_0px_-1px_0px_0px_rgba(0,_0,_0,_0.1),_inset_0px_1px_0px_0px_rgba(255,_255,_255,_0.3)]  
  rounded-full text-sm font-medium transition-colors ${
    (multiple ? value.includes(option) : value === option)
      ? "bg-gradient-to-b from-purple-500 to-purple-600 text-white"
      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
  }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default CustomToggleGroup;
