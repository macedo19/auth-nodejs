import * as bcrypt from 'bcrypt';

function validateNameUser(name: string): boolean {
  const nameRegex = /^[a-zA-Z\s]+$/;
  return nameRegex.test(name);
}

function validateLastName(lastName: string): boolean {
  const lastNameRegex = /^[a-zA-Z\s]+$/;
  return lastNameRegex.test(lastName);
}

function validatePassword(password: string): boolean {
  const regexUpperCase = /[A-Z]/;
  if (!regexUpperCase.test(password)) {
    return false;
  }

  const regexLowerCase = /[a-z]/;
  if (!regexLowerCase.test(password)) {
    return false;
  }

  const regexNumber = /[0-9]/;
  if (!regexNumber.test(password)) {
    return false;
  }

  return password.length >= 6;
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return false;
  }

  return emailRegex.test(email);
}

async function encrypitPassword(password: string): Promise<string> {
  const salt = 10;
  const hashPassword = await bcrypt.hash(password, salt);
  return hashPassword;
}

export {
  validateNameUser,
  validatePassword,
  validateEmail,
  validateLastName,
  encrypitPassword,
};
