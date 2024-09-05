// src/components/Select.jsx
import React, { useState } from 'react';
import '../styles/Select.css'; // Import CSS file for styling

const Select = ({ options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (option) => {
    setSelectedValue(option.value);
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="custom-select">
      <div className="select-header" onClick={handleToggle}>
        {selectedValue ? (
          options.find(option => option.value === selectedValue).label
        ) : (
          placeholder
        )}
      </div>
      {isOpen && (
        <div className="select-options">
          {options.map(option => (
            <div
              key={option.value}
              className="select-option"
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Select;
