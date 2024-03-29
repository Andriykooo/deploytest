import { connectSocket } from "@/context/socket";
import axios from "axios";
import { store } from "@/store/store";

import { alertToast } from "./alert";
import { apiUrl, fallbackLng } from "./constants";
import {
  addLocalStorageItem,
  clearLocalStorage,
  getLocalStorageItem,
} from "./localStorage";

import { disconnectSocket } from "@/context/socket";
import { destroySession } from "@/store/actions";
import { nextWindow } from "./nextWindow";
import moment from "moment";
import { CustomCookie } from "./cookie";

const getLanguage = () => {
  return (
    CustomCookie.get("language") ||
    getLocalStorageItem("language") ||
    fallbackLng
  );
};

const clearStorage = () => {
  if (!nextWindow.location.pathname.includes("/login")) {
    const language = getLanguage();
    nextWindow.location.href = `/${language}/login`;
    clearLocalStorage();
    store.dispatch(destroySession());
    disconnectSocket();
  }
};

const checkError = (code, message) => {
  const language = getLanguage();

  switch (code) {
    // Country Block
    case 483:
      nextWindow.location.href = `/${language}/customer_service_notice`;
      break;

    // Self-Exclude Account
    case 488:
      clearStorage();
      break;

    // Suspended Account
    case 1104:
      break;

    // Suspended Account
    case 1063:
      break;

    // Suspended Account
    case 485:
      clearStorage();

      break;

    // Suspended Account
    case 487:
      clearStorage();

      break;

    // Suspended Closed
    case 2280:
      break;

    // Excluded Account
    case 1062:
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
  if (error.response.status >= 500 || error.code === "ERR_NETWORK") {
    const language = getLanguage();
    window.location.href = `/${language}/maintenance`;
  }

  if (!showError) {
    throw error;
  }

  const code = error?.response?.status;
  const message =
    error?.response?.data?.error?.message ||
    error?.response?.data?.message ||
    error?.message;
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

const axiosService = {
  isRefreshingToken: false,
  failedQueue: [],

  processQueue(error, token = null) {
    this.failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });

    this.failedQueue = [];
  },

  async refreshToken() {
    const headers = {
      "content-type": "application/json",
    };

    const body = JSON.stringify({
      refresh_token: getLocalStorageItem("refresh_token"),
      swifty_id: getLocalStorageItem("swifty_id"),
    });

    const response = await axios.post(apiUrl.URI_REFRESH_TOKEN, body, {
      headers,
    });

    return response.data;
  },

  async onRequest(config) {
    if (config?.headers) {
      if (getLocalStorageItem("access_token")) {
        config.headers.Authorization = `Bearer ${getLocalStorageItem(
          "access_token"
        )}`;
      }

      config.headers["device-id"] = getLocalStorageItem("device_id");
      config.headers.country = getLocalStorageItem("country") || "all";
      config.headers.language = getLanguage();
    }

    return config;
  },

  async onResponseError(err) {
    const originalRequest = err.config;

    // console.log(err);

    if (
      err.response.status === 401 &&
      !originalRequest._retry &&
      getLocalStorageItem("refresh_token")
    ) {
      if (this.isRefreshingToken) {
        return new Promise((resolve, reject) => {
          this.failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return axiosInstance.request(originalRequest);
          })
          .catch((err) => {
            handleError(err);
          });
      }

      originalRequest._retry = true;
      this.isRefreshingToken = true;

      return new Promise((resolve) => {
        this.refreshToken()
          .then(({ token, refresh_token }) => {
            this.isRefreshingToken = false;
            addLocalStorageItem("access_token", token);
            addLocalStorageItem("refresh_token", refresh_token);
            this.processQueue(null, token);
            originalRequest.headers["Authorization"] = "Bearer " + token;
            resolve(axiosInstance.request(originalRequest));
            connectSocket(token);
          })
          .catch(() => {
            clearStorage();
          });
      });
    }

    // handleError(err);
    throw err;
  },
};

const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
    "browser-timezone-offset": moment().utcOffset(),
    "device-id": getLocalStorageItem("device_id"),
    Accept: "application/json",
    platform: "web",
    "app-version": "1",
  },
});

axiosInstance.interceptors.request.use(
  (config) => axiosService.onRequest(config),
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
    if (
      response.status === 213 &&
      !nextWindow.location.href.includes("/change_password")
    ) {
      const language = getLanguage();
      nextWindow.location.href = `/${language}/change_password`;
    }

    return response.data;
  },
  (error) => axiosService.onResponseError(error)
);

class ApiServices {
  /**
   * @type {import('axios').AxiosInstance}
   */
  #requestInstance = null;

  constructor(instance) {
    this.#requestInstance = instance;
  }

  /**
   * @param {string} url
   * @param { Record<string, any> } body
   * @param options { import('axios').AxiosRequestConfig }
   * @returns {Promise<AxiosResponse<any> | void>}
   */
  get(url, body, options = {}) {
    return this.#requestInstance
      .get(url, { params: body, ...options })
      .catch(handleError);
  }

  post(url, body, showError = true, options) {
    return this.#requestInstance
      .post(url, body, options)
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
