import React from "react";

const SelectField = ({ id, value, onChange, options, label }) => (
  <div>
    <label htmlFor={id} className="label-field">
      {label}
    </label>
    <select
      id={id}
      value={value}
      onChange={onChange}
      className="select-field"
      required
    >
      <option value="">Pilih Role</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

export default SelectField;
