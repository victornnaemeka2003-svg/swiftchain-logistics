import validator from 'validator';

export function validateEmail(email) {
  return validator.isEmail(email);
}

export function validatePassword(password) {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*]/.test(password);

  return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
}

export function validatePhone(phone) {
  return validator.isMobilePhone(phone);
}

export function validateAddress(address) {
  return address && address.length >= 5 && address.length <= 500;
}

export function validateCurrency(amount) {
  return validator.isDecimal(amount.toString(), { decimal_digits: '1,2' });
}
