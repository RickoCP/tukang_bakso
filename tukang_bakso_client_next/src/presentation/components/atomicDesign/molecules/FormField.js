import React from "react";
import InputField from "../atoms/InputField";

const FormField = ({ label, id, type, value, onChange, placeholder, maxLength, required }) => (
  <InputField
    label={label}
    id={id}
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    maxLength={maxLength}
    required={required}
  />
);

export default FormField;
