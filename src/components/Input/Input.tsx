import React from "react";

interface InputProps {
  autoFocus?: boolean;
  type?: string;
  name: string;
  value: string | string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  error?: string;
  required?: boolean;
}

const Input: React.FC<InputProps> = ({
  autoFocus = false,
  type = "text",
  name,
  value,
  onChange,
  placeholder = "",
  label = "",
  className = "",
  error = "",
  required = false,
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={name} className="block mb-2">
          {label}
        </label>
      )}
      <input
        autoComplete="on"
        autoFocus={autoFocus}
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`border rounded py-1 px-2 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {/* {error && (
        <span className="text-red-500 text-sm mt-1 block">{error}</span>
      )} */}
    </div>
  );
};

export default Input;
