// src/components/PhoneNumber/data/countries.ts
export interface CountryPhoneData {
  name: string;
  countryCode: string;
  flag: string;
  dialCode: string;
  formatRegex: RegExp;
  maxLength: number;
  validationRegex: RegExp;
  region:
    | "Africa"
    | "Europe"
    | "North America"
    | "South America"
    | "Asia"
    | "Oceania"
    | "Caribbean";
}

const countriesPhoneData: CountryPhoneData[] = [
  // African Countries
  {
    name: "Gambia",
    countryCode: "GM",
    flag: "🇬🇲",
    dialCode: "+220",
    formatRegex: /^(\d{3})(\d{4})$/,
    maxLength: 7,
    validationRegex: /^[2-9]\d{6}$/,
    region: "Africa",
  },
  {
    name: "Senegal",
    countryCode: "SN",
    flag: "🇸🇳",
    dialCode: "+221",
    formatRegex: /^(\d{2})(\d{3})(\d{2})(\d{2})$/,
    maxLength: 9,
    validationRegex: /^[0-9]\d{8}$/,
    region: "Africa",
  },
  {
    name: "Nigeria",
    countryCode: "NG",
    flag: "🇳🇬",
    dialCode: "+234",
    formatRegex: /^(\d{3})(\d{3})(\d{4})$/,
    maxLength: 10,
    validationRegex: /^[0-9]\d{9}$/,
    region: "Africa",
  },
  {
    name: "Ghana",
    countryCode: "GH",
    flag: "🇬🇭",
    dialCode: "+233",
    formatRegex: /^(\d{3})(\d{3})(\d{3})$/,
    maxLength: 9,
    validationRegex: /^[0-9]\d{8}$/,
    region: "Africa",
  },
  {
    name: "Kenya",
    countryCode: "KE",
    flag: "🇰🇪",
    dialCode: "+254",
    formatRegex: /^(\d{3})(\d{3})(\d{3})$/,
    maxLength: 9,
    validationRegex: /^[0-9]\d{8}$/,
    region: "Africa",
  },
  {
    name: "South Africa",
    countryCode: "ZA",
    flag: "🇿🇦",
    dialCode: "+27",
    formatRegex: /^(\d{2})(\d{3})(\d{4})$/,
    maxLength: 9,
    validationRegex: /^[0-9]\d{8}$/,
    region: "Africa",
  },
  {
    name: "Egypt",
    countryCode: "EG",
    flag: "🇪🇬",
    dialCode: "+20",
    formatRegex: /^(\d{3})(\d{3})(\d{4})$/,
    maxLength: 10,
    validationRegex: /^[0-9]\d{9}$/,
    region: "Africa",
  },
  {
    name: "Morocco",
    countryCode: "MA",
    flag: "🇲🇦",
    dialCode: "+212",
    formatRegex: /^(\d{3})(\d{2})(\d{2})(\d{2})$/,
    maxLength: 9,
    validationRegex: /^[0-9]\d{8}$/,
    region: "Africa",
  },
  {
    name: "Ethiopia",
    countryCode: "ET",
    flag: "🇪🇹",
    dialCode: "+251",
    formatRegex: /^(\d{3})(\d{3})(\d{3})$/,
    maxLength: 9,
    validationRegex: /^[0-9]\d{8}$/,
    region: "Africa",
  },
  {
    name: "Tanzania",
    countryCode: "TZ",
    flag: "🇹🇿",
    dialCode: "+255",
    formatRegex: /^(\d{3})(\d{3})(\d{3})$/,
    maxLength: 9,
    validationRegex: /^[0-9]\d{8}$/,
    region: "Africa",
  },

  // Add more African countries as needed

  // Other Regions
  {
    name: "United States",
    countryCode: "US",
    flag: "🇺🇸",
    dialCode: "+1",
    formatRegex: /^(\d{3})(\d{3})(\d{4})$/,
    maxLength: 10,
    validationRegex: /^[2-9]\d{2}[2-9]\d{2}\d{4}$/,
    region: "North America",
  },
  {
    name: "United Kingdom",
    countryCode: "GB",
    flag: "🇬🇧",
    dialCode: "+44",
    formatRegex: /^(\d{4})(\d{3})(\d{3})$/,
    maxLength: 10,
    validationRegex: /^[1-9]\d{9}$/,
    region: "Europe",
  },
  {
    name: "India",
    countryCode: "IN",
    flag: "🇮🇳",
    dialCode: "+91",
    formatRegex: /^(\d{5})(\d{5})$/,
    maxLength: 10,
    validationRegex: /^[6-9]\d{9}$/,
    region: "Asia",
  },
  {
    name: "Canada",
    countryCode: "CA",
    flag: "🇨🇦",
    dialCode: "+1",
    formatRegex: /^(\d{3})(\d{3})(\d{4})$/,
    maxLength: 10,
    validationRegex: /^[2-9]\d{2}[2-9]\d{2}\d{4}$/,
    region: "North America",
  },
];

// Additional utility functions
export const getCountryByCode = (countryCode: string) => {
  return (
    countriesPhoneData.find(
      (country) =>
        country.countryCode.toLowerCase() === countryCode.toLowerCase()
    ) || countriesPhoneData[0]
  );
};

export const getCountriesByRegion = (region: CountryPhoneData["region"]) => {
  return countriesPhoneData.filter((country) => country.region === region);
};

export default countriesPhoneData;
