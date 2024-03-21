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
    // localStorage.removeItem("device_id");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("swifty_id");
    localStorage.removeItem("kyc_access_token");
    localStorage.removeItem("persist:root");

    localStorage.clear();
  }
};
