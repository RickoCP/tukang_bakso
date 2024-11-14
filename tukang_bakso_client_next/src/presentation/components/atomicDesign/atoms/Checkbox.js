import React from "react";

const Checkbox = ({ id, checked, onChange, label }) => (
  <div className="flex items-center mt-4">
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={onChange}
      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
      required
    />
    <label htmlFor={id} className="ml-2 text-sm text-gray-600">
      {label}
    </label>
  </div>
);

export default Checkbox;
