import React from "react";

const Button = ({ onClick, children, className }) => (
  <button onClick={onClick} className={`p-2 rounded shadow-md ${className}`}>
    {children}
  </button>
);

export default Button;
