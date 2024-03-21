export const validateUserEmail = (email) => {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
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
