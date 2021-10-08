import React, { useState } from 'react';
import './SearchInput.scss';

const DEFAULT_INITIAL_VALUE = '';

const SearchInput = ({ label, error, initialValue = DEFAULT_INITIAL_VALUE, onChange }) => {
  const [value, setValue] = useState(initialValue);
  const handleOnChange = (e) => {
    const { value } = e.target;
    setValue(value);
    onChange(value);
  }

  return (
    <div className="input-wrapper">
      <label>
        {label && <div className="input-label">{label}</div>}
        <input
          className="input"
          name="crypto-search"
          type="text"
          value={value}
          onChange={handleOnChange}
        />
      </label>
      {error && (
        <div className="error-container">{error}</div>
      )}
    </div>
  );
};

export default SearchInput;
