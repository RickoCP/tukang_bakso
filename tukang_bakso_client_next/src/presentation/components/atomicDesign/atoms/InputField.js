import React from "react";

const InputField = ({ label, id, type, value, onChange, placeholder, maxLength, required }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      maxLength={maxLength}
      placeholder={placeholder}
      className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
      required={required}
    />
  </div>
);

export default InputField;
