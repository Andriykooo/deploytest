import { refreshCommunicationSocket } from "@/context/socket";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { alertToast } from "./alert";
import { apiUrl } from "./constants";
import {
  addLocalStorageItem,
  clearLocalStorage,
  getLocalStorageItem,
} from "./localStorage";
import { nextWindow } from "./nextWindow";

const checkError = (code, message) => {
  switch (code) {
    // Country Block
    case 483:
      nextWindow.location.href = "/customer_service_notice";
      break;

    // Self-Exclude Account
    case 488:
      nextWindow.location.href = "/login";
      break;

    // Suspended Account
    case 1104:
      break;

    // Suspended Account
    case 1063:
      break;

    // Excluded Account
    case 1062:
      break;

    // Suspended Account
    case 487:
      break;

    // Account Exists
    case 1026:
      if (typeof window !== "undefined") {
        alertToast({
          message:
            "There is already an account with this email, please login with email.",
        });
      }
      break;

    default:
      if (typeof window !== "undefined") {
        alertToast({
          message,
        });
      }
  }
};

const handleError = (error, showError = true) => {
  if (!showError) {
    throw error;
  }
  if (error?.message.toLowerCase() === "network error") {
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

  const invalidPasswordStatus = error?.response?.data?.error?.code;

  if (invalidPasswordStatus) {
    checkError(invalidPasswordStatus, message);

    throw error;
  }

  checkError(code, message);

  throw error;
};

const axiosInstance = axios.create({
  headers: {
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
    if (
      error.response?.status === 401 &&
      getLocalStorageItem("refresh_token")
    ) {
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
        } = await axios.post(apiUrl.URI_REFRESH_TOKEN, body, {
          headers,
        });

        addLocalStorageItem("access_token", token);
        addLocalStorageItem("refresh_token", refresh_token);
        refreshCommunicationSocket(token);

        error.config.headers = {
          ...error.config.header,
          Authorization: `Bearer ${token}`,
        };

        return axiosInstance.request(error.config);
      } catch (error) {
        if (error?.response?.status === 401) {
          clearLocalStorage();
          nextWindow.location.href = "/login";
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

  get(url, body, options = {}) {
    return this.#requestInstance
      .get(url, { params: body, ...options })
      .catch(handleError);
  }

  post(url, body, showError = true) {
    return this.#requestInstance
      .post(url, body)
      .catch((error) => handleError(error, showError));
  }

  put(url, body) {
    return this.#requestInstance.put(url, body).catch(handleError);
  }

  delete(url, body) {
    return this.#requestInstance.delete(url, { data: body }).catch(handleError);
  }
}

export const apiServices = new ApiServices(axiosInstance);
