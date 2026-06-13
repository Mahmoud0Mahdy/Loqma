export const patterns = {
  // Phone Number (7 - 15 chars)
  phone: /^[0-9+\-\s()]{7,15}$/,

  // Address (5 - 100 chars)
  address: /^[A-Za-z0-9\s.,#-]{5,100}$/,

  // City (2 - 20 chars)
  city: /^[A-Za-z\s]{2,20}$/,

  // State (2 - 20 chars)
  state: /^[A-Za-z\s]{2,20}$/,

  // Zip Code (exactly 5 digits)
  zipCode: /^[0-9]{5}$/,
};

export const validateField = (field: string, value: string) => {
  const trimmedValue = value.trim();

  // Required field validation
  if (!trimmedValue) {
    return false;
  }

  switch (field) {
    case "phone":
      return patterns.phone.test(trimmedValue);

    case "address":
      return patterns.address.test(trimmedValue);

    case "city":
      return patterns.city.test(trimmedValue);

    case "state":
      return patterns.state.test(trimmedValue);

    case "zipCode":
      return patterns.zipCode.test(trimmedValue);

    default:
      return true;
  }
};
