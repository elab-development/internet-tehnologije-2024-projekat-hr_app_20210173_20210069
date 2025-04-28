import React from 'react';

const FormInput = ({ label, type = 'text', name, value, onChange, required = false }) => (
  <div style={{ marginBottom: '5px' }}>
    <label>{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
    />
  </div>
);

export default FormInput;
