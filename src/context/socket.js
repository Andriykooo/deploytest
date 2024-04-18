"use client";

import { addLocalStorageItem, getLocalStorageItem } from "@/utils/localStorage";
import { io } from "socket.io-client";
import moment from "moment";
import Cookies from "js-cookie";
import { apiUrl, fallbackLng } from "@/utils/constants";
import { apiServices, clearStorage } from "@/utils/apiServices";

const commonOptions = {
  transports: ["websocket"],
  auth: {
    token: getLocalStorageItem("access_token"),
    "device-id": getLocalStorageItem("device_id"),
    "browser-timezone-offset": moment().utcOffset(),
    platform: "web",
    language:
      Cookies.get("language") || getLocalStorageItem("language") || fallbackLng,
  },
};

class CustomSocket {
  constructor(url, args) {
    this.socket = io(url, args);
  }

  disconnect() {
    return this.socket.disconnect();
  }

  connect() {
    return this.socket.connect();
  }

  on(...args) {
    this.socket.on(...args);
  }

  off(...args) {
    this.socket.off(...args);
  }

  emit(emitName, args, callback) {
    this.socket.emit(emitName, args, async (response) => {
      if (
        response.status == false &&
        (response.data.code === 1012 || response.data.code === 1036) &&
        getLocalStorageItem("refresh_token")
      ) {
        const headers = {
          "content-type": "application/json",
        };

        const body = JSON.stringify({
          refresh_token: getLocalStorageItem("refresh_token"),
          swifty_id: getLocalStorageItem("swifty_id"),
        });

        try {
          const { token, refresh_token } = await apiServices.post(
            apiUrl.URI_REFRESH_TOKEN,
            body,
            false,
            {
              headers,
            }
          );

          addLocalStorageItem("access_token", token);
          addLocalStorageItem("refresh_token", refresh_token);
          connectSocket(token);

          this.emit(emitName, args, callback);
        } catch {
          clearStorage();
        }

        return;
      }

      callback && callback(response);
    });
  }
}

export const gamingSocket = new CustomSocket(
  process.env.NEXT_PUBLIC_GAMING_SOCKET_URL,
  commonOptions
);

export const communicationSocket = new CustomSocket(
  process.env.NEXT_PUBLIC_COMMINICATION_SOCKET_URL,
  { ...commonOptions, autoConnect: false }
);

export const connectSocket = (token, deviceId) => {
  if (deviceId) {
    gamingSocket.socket.auth["device-id"] = deviceId;
    communicationSocket.socket.auth["device-id"] = deviceId;
  }

  if (token) {
    communicationSocket.socket.auth.token = token;
    gamingSocket.socket.auth.token = token;

    if (communicationSocket.socket.connected) {
      communicationSocket.disconnect().connect();
    } else {
      communicationSocket.connect();
    }
  }

  if (gamingSocket.socket.connected) {
    gamingSocket.disconnect().connect();
  } else {
    gamingSocket.connect();
  }
};

export const disconnectSocket = () => {
  if (communicationSocket.socket.connected) {
    communicationSocket.disconnect();
  }

  if (gamingSocket.socket.connected) {
    gamingSocket.socket.auth.token = null;
    gamingSocket.disconnect().connect();
  }
};
