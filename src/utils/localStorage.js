export const getLocalStorageItem = (key) => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(key);
  }
};

export const addLocalStorageItem = (key, value) => {
  if (typeof window !== "undefined") {
    return localStorage.setItem(key, value);
  }
};

export const removeLocalStorageItem = (key) => {
  if (typeof window !== "undefined") {
    return localStorage.removeItem(key);
  }
};

export const clearLocalStorage = () => {
  if (typeof window !== "undefined") {
    return localStorage.clear();
  }
};
