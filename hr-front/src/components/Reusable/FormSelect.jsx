import React from 'react';

const FormSelect = ({ label, name, value, onChange, options = [], required = false }) => (
  <div style={{ marginBottom: '5px' }}>
    <label>{label}</label>
    <select name={name} value={value} onChange={onChange} required={required}>
      <option value="">Izaberi...</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

export default FormSelect;