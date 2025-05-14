export const validators = {
  email: (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },

  password: (value: string): boolean => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return passwordRegex.test(value);
  },

  phoneNumber: (value: string): boolean => {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(value);
  },

  required: (value: string): boolean => {
    return value.trim().length > 0;
  },

  minLength: (value: string, length: number): boolean => {
    return value.length >= length;
  },

  maxLength: (value: string, length: number): boolean => {
    return value.length <= length;
  },

  number: (value: string): boolean => {
    return !isNaN(Number(value));
  },

  price: (value: string): boolean => {
    const priceRegex = /^\d+(\.\d{1,2})?$/;
    return priceRegex.test(value);
  }
}; 