"use client";

import { getLocalStorageItem } from "@/utils/localStorage";
import { io } from "socket.io-client";
import moment from "moment";

// eslint-disable-next-line
export const gamingSocket = io(process.env.NEXT_PUBLIC_GAMING_SOCKET_URL, {
  transports: ["websocket"],
  auth: {
    token: getLocalStorageItem("access_token"),
    "device-id": getLocalStorageItem("device_id"),
    "browser-timezone-offset": moment().utcOffset(),
    platform: "web",
    language: getLocalStorageItem("language") || "en",
  },
});

export const communicationSocket = io(
  process.env.NEXT_PUBLIC_COMMINICATION_SOCKET_URL,
  {
    autoConnect: false,
    transports: ["websocket"],
    auth: {
      token: getLocalStorageItem("access_token"),
      "device-id": getLocalStorageItem("device_id"),
      "browser-timezone-offset": moment().utcOffset(),
      platform: "web",
      language: getLocalStorageItem("language") || "en",
    },
  }
);

export const connectSocket = (token) => {
  if (token) {
    communicationSocket.auth.token = token;
    communicationSocket.connect();
    gamingSocket.auth.token = token;
  }

  if (gamingSocket.connected) {
    gamingSocket.disconnect().connect();
  } else {
    gamingSocket.connect();
  }
};

export const disconnectSocket = () => {
  if (communicationSocket.connected) {
    communicationSocket.disconnect();
  }

  if (gamingSocket.connected) {
    gamingSocket.auth.token = null;
    gamingSocket.disconnect().connect();
  }
};
