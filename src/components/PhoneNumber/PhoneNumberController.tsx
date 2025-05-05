// src/components/PhoneNumber/PhoneNumberController.tsx
import React, { useState, useEffect, useRef } from "react";
import { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Controller } from "../../types";
import countriesPhoneData, { CountryPhoneData } from "./data/countries";
import { cn } from "../../utils";

type PhoneNumberControllerProps = {
  field: ControllerRenderProps<z.TypeOf<any>, any>;
  controller: Controller;
  form: UseFormReturn<z.TypeOf<any>, any, undefined>;
};

const PhoneNumberController: React.FC<PhoneNumberControllerProps> = ({
  field,
  controller,
  form,
}) => {
  // State management
  const [selectedCountry, setSelectedCountry] = useState<CountryPhoneData>(
    countriesPhoneData.find(
      (c) => c.countryCode === (controller.defaultValue?.countryCode || "US")
    ) || countriesPhoneData[0]
  );
  const [phoneNumber, setPhoneNumber] = useState(
    field.value?.phoneNumber || ""
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Enhanced filtering for countries
  const filteredCountries = countriesPhoneData.filter((country) => {
    // Normalize search query
    const normalizedQuery = searchQuery.toLowerCase().trim();

    // Check for matches in:
    // 1. Country name
    // 2. Country code
    // 3. Dial code
    // 4. Partial matches
    return (
      country.name.toLowerCase().includes(normalizedQuery) ||
      country.countryCode.toLowerCase().includes(normalizedQuery) ||
      country.dialCode.includes(normalizedQuery)
    );
  });

  // Sort filtered countries to prioritize exact matches
  const sortedFilteredCountries = filteredCountries.sort((a, b) => {
    const normalizedQuery = searchQuery.toLowerCase().trim();

    // Exact name match
    const nameExactMatchA = a.name.toLowerCase() === normalizedQuery;
    const nameExactMatchB = b.name.toLowerCase() === normalizedQuery;

    // Exact code match
    const codeExactMatchA = a.countryCode.toLowerCase() === normalizedQuery;
    const codeExactMatchB = b.countryCode.toLowerCase() === normalizedQuery;

    // Exact dial code match
    const dialExactMatchA = a.dialCode === normalizedQuery;
    const dialExactMatchB = b.dialCode === normalizedQuery;

    // Prioritize exact matches
    if (nameExactMatchA !== nameExactMatchB) {
      return nameExactMatchA ? -1 : 1;
    }
    if (codeExactMatchA !== codeExactMatchB) {
      return codeExactMatchA ? -1 : 1;
    }
    if (dialExactMatchA !== dialExactMatchB) {
      return dialExactMatchA ? -1 : 1;
    }

    // If no exact matches, sort alphabetically
    return a.name.localeCompare(b.name);
  });

  // Handle country selection
  const handleCountrySelect = (country: CountryPhoneData) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
    setSearchQuery("");
    // Focus back on the phone number input
    searchInputRef.current?.blur();
  };

  // Format phone number based on country's format
  const formatPhoneNumber = (input: string) => {
    // Remove non-digit characters
    const cleaned = input.replace(/\D/g, "");

    // Truncate to max length
    const truncated = cleaned.slice(0, selectedCountry.maxLength);

    // If no format regex, return as-is
    if (!selectedCountry.formatRegex) return truncated;

    // Apply formatting
    const match = truncated.match(selectedCountry.formatRegex);
    if (match) {
      return match.slice(1).join(" ");
    }
    return truncated;
  };

  // Validate phone number
  const validatePhoneNumber = (input: string) => {
    const cleaned = input.replace(/\D/g, "");
    return selectedCountry.validationRegex.test(cleaned);
  };

  // Handle phone number input
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);

    // Update form value
    const cleanedNumber = formatted.replace(/\D/g, "");
    form.setValue(field.name, {
      countryCode: selectedCountry.countryCode,
      dialCode: selectedCountry.dialCode,
      phoneNumber: cleanedNumber,
    });

    // Validate
    if (validatePhoneNumber(cleanedNumber)) {
      form.clearErrors(field.name);
    } else {
      form.setError(field.name, {
        type: "manual",
        message: `Invalid phone number for ${selectedCountry.name}`,
      });
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="flex items-center border rounded-md overflow-hidden">
        {/* Country selector */}
        <div
          className="relative cursor-pointer flex items-center px-2 border-r"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <span className="mr-1 text-xl">{selectedCountry.flag}</span>
          <span className="text-sm text-gray-600">
            {selectedCountry.dialCode}
          </span>
        </div>

        {/* Phone number input */}
        <input
          {...field}
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          placeholder={controller.placeholder || "Enter phone number"}
          className="flex-grow px-2 py-2 outline-none w-full"
          maxLength={
            selectedCountry.maxLength +
            (selectedCountry.formatRegex
              ? selectedCountry.formatRegex.toString().match(/\(\?:/g)
                  ?.length || 0
              : 0)
          }
        />
      </div>

      {/* Country dropdown */}
      {isDropdownOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
          {/* Search input */}
          <div className="p-2 sticky top-0 bg-white z-10">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search country, code, or dial code"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-2 py-1 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Country list */}
          {sortedFilteredCountries.length > 0 ? (
            sortedFilteredCountries.map((country) => (
              <div
                key={country.countryCode}
                className={cn(
                  "px-3 py-2 flex items-center cursor-pointer hover:bg-gray-100 transition-colors",
                  selectedCountry.countryCode === country.countryCode
                    ? "bg-blue-50"
                    : ""
                )}
                onClick={() => handleCountrySelect(country)}
              >
                <span className="mr-2 text-xl">{country.flag}</span>
                <div className="flex-grow">
                  <div className="font-medium">{country.name}</div>
                  <div className="text-xs text-gray-500">
                    {country.countryCode}
                  </div>
                </div>
                <span className="text-gray-500 font-mono">
                  {country.dialCode}
                </span>
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-center text-gray-500">
              No countries found
            </div>
          )}
        </div>
      )}

      {/* Error message */}
      {form.formState.errors[field.name] && (
        <p className="mt-1 text-xs text-red-500">
          {form.formState.errors[field.name]?.message?.toString()}
        </p>
      )}
    </div>
  );
};

export default PhoneNumberController;
