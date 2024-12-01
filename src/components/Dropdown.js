import React from "react";
import "./Dropdown.css"; 

function Dropdown({ label, options, selected, onChange }) {
  return (
    <div className="dropdown">
      <label>
        {label}:
        <select
          value={selected}
          onChange={(e) => onChange(e.target.value)}
          className="dropdown-select"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

export default Dropdown;
