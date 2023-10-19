import validator from "validator";

export const validateUserEmail = (email) => {
  return validator.isEmail(email || "");
};

export const validateUserPassword = (password) => {
  let passwordValidity = { length: false, specialChar: false, numeric: false };
  if (password.length > 7) {
    passwordValidity.length = true;
  }
  if (/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password)) {
    passwordValidity.specialChar = true;
  }

  if (/\d/.test(password)) {
    passwordValidity.numeric = true;
  }
  return passwordValidity;
};
