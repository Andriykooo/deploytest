"use client";

import { getLocalStorageItem } from "@/utils/localStorage";
import React from "react";
import { io } from "socket.io-client";
import moment from "moment";

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

export const refreshCommunicationSocket = (token) => {
  communicationSocket.auth.token = token;
  communicationSocket.disconnect().connect();
};

export const refreshGamingSocket = (token) => {
  gamingSocket.auth.token = token;
  gamingSocket.disconnect().connect();
};

export const SocketContext = React.createContext();
