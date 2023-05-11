import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { alertToast } from "./alert";
import { apiUrl } from "./constants";
import { clearLocalStorage, getLocalStorageItem, addLocalStorageItem } from "./localStorage";

const checkError = (code, message) => {
  switch (code) {
    // Suspend Account
    case 487:
      alertToast({ message: message });
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
      break;

    // Self-Exclude Account
    case 488:
      alertToast({ message: message });
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
      break;

    // Account Exists
    case 1026:
      alertToast({
        message:
          " There is already an account with this email, please login with email ",
      });
      break;

    // Others
    default:
      alertToast({ message: message });
  }
};

const handleError = (error) => {
  if (error?.message.toLowerCase() === "network error") {
    alertToast({ message: "Network Error" });

    return;
  }

  const code = error?.response?.status;
  const message = error?.response?.data?.error?.message;
  const suspendUntil =
    error?.response?.data?.error?.extra_data?.suspended_until;

  if (suspendUntil) {
    const time = new Date(suspendUntil).toLocaleString("en-US", {
      hour12: false,
    });
    checkError(code, message.replace(/{date}/g, time));

    throw error;
  }

  checkError(code, message);

  throw error;
};

const axiosInstance = axios.create({
  headers: {
    Authorization: `Bearer ${getLocalStorageItem("access_token")}`,
    "Content-Type": "application/json",
    Accept: "application/json",
    language: "en",
    platform: "web",
    app_version: "1",
  },
});

axiosInstance.interceptors.request.use((config) => {
  if (config?.headers && getLocalStorageItem("access_token")) {
    config.headers.Authorization = `Bearer ${getLocalStorageItem(
      "access_token"
    )}`;
  }

  config.headers.device_id = getLocalStorageItem("device_id") || uuidv4();

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const headers = {
          "content-type": "application/json",
        };

        const body = JSON.stringify({
          refresh_token: getLocalStorageItem("refresh_token"),
          swifty_id: getLocalStorageItem("swifty_id"),
        });

        const {
          data: { token, refresh_token },
        } = await axios.post(apiUrl.NEXT_PUBLIC_URI_REFRESH_TOKEN, body, {
          headers,
        });

        addLocalStorageItem("access_token", token);
        addLocalStorageItem("refresh_token", refresh_token);

        error.config.headers = {
          ...error.config.header,
          Authorization: `Bearer ${token}`,
        };

        return axiosInstance.request(error.config);
      } catch (error) {
        if (error.response.status === 401) {
          clearLocalStorage();
          window.location.href = "/login";
        } else {
          throw error;
        }
      }
    } else {
      throw error;
    }
  }
);

class ApiServices {
  #requestInstance = null;

  constructor(instance) {
    this.#requestInstance = instance;
  }

  get(url) {
    return this.#requestInstance.get(url).catch(handleError);
  }

  post(url, body) {
    return this.#requestInstance.post(url, body).catch(handleError);
  }

  put(url, body) {
    return this.#requestInstance.put(url, body).catch(handleError);
  }

  delete(url) {
    return this.#requestInstance.delete(url).catch(handleError);
  }
}

export const apiServices = new ApiServices(axiosInstance);
