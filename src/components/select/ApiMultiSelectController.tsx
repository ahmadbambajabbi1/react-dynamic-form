// src/components/select/ApiMultiSelectController.tsx
import React, { useState, useRef, useEffect } from "react";
import { SelectOption, MultiSelectProps, ApiProps } from "./types";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import Axios from "../../utils/axiosConfig";

const ApiMultiSelectController: React.FC<MultiSelectProps & ApiProps> = ({
  name,
  label,
  placeholder = "Select options",
  disabled = false,
  required = false,
  error,
  className = "",
  menuPlacement = "auto",
  onChange,
  value = [],
  endpoint,
  transformResponse = (data) => data,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<"top" | "bottom">(
    "bottom"
  );
  const selectRef = useRef<HTMLDivElement>(null);

  // Handle outside click to close dropdown
  useOutsideClick(selectRef, () => setIsOpen(false));

  // Fetch options from API
  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true);
      try {
        const response = await Axios.get(endpoint);
        const transformedData = transformResponse(response.data);
        setOptions(transformedData);
      } catch (error) {
        console.error("Error fetching options:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [endpoint, transformResponse]);

  // Determine dropdown position
  useEffect(() => {
    if (!isOpen || !selectRef.current) return;

    const rect = selectRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const contentHeight = 220; // Approximate dropdown height

    if (menuPlacement === "top") {
      setDropdownPosition("top");
    } else if (menuPlacement === "bottom") {
      setDropdownPosition("bottom");
    } else {
      // Auto placement based on available space
      if (spaceBelow < contentHeight && spaceAbove > spaceBelow) {
        setDropdownPosition("top");
      } else {
        setDropdownPosition("bottom");
      }
    }
  }, [isOpen, menuPlacement]);

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (option: SelectOption) => {
    // Check if option is already selected
    const isSelected = value.some((item) => item.id === option.id);

    if (isSelected) {
      // Remove option if already selected
      onChange(value.filter((item) => item.id !== option.id));
    } else {
      // Add option if not selected
      onChange([...value, option]);
    }
  };

  const removeOption = (option: SelectOption, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter((item) => item.id !== option.id));
  };

  return (
    <div
      className={`select-container multi-select ${className}`}
      ref={selectRef}
    >
      {label && (
        <label className="select-label">
          {label}
          {required && <span className="required-mark">*</span>}
        </label>
      )}

      <div
        className={`select-control ${disabled ? "disabled" : ""} ${
          error ? "error" : ""
        }`}
        onClick={toggleDropdown}
      >
        {value.length > 0 ? (
          <div className="selected-options">
            {value.map((option) => (
              <div key={option.id} className="selected-tag">
                <span>{option.label}</span>
                <button
                  type="button"
                  className="remove-tag"
                  onClick={(e) => removeOption(option, e)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        ) : (
          <span className="placeholder">{placeholder}</span>
        )}
        <span className={`arrow ${isOpen ? "up" : "down"}`}>▼</span>
      </div>

      {error && <p className="error-message">{error}</p>}

      {isOpen && (
        <div className={`dropdown-menu ${dropdownPosition}`}>
          {loading ? (
            <div className="loading">Loading options...</div>
          ) : options.length > 0 ? (
            options.map((option) => {
              const isSelected = value.some((item) => item.id === option.id);
              return (
                <div
                  key={option.id}
                  className={`dropdown-item ${isSelected ? "selected" : ""}`}
                  onClick={() => handleSelect(option)}
                >
                  <div className="checkbox">
                    {isSelected && <span className="checkmark">✓</span>}
                  </div>
                  <span>{option.label}</span>
                </div>
              );
            })
          ) : (
            <div className="no-options">No options available</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ApiMultiSelectController;
