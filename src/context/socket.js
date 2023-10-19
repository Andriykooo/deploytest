"use client";

import { getLocalStorageItem } from "@/utils/localStorage";
import React from "react";
import { io } from "socket.io-client";

export const gamingSocket = io(process.env.NEXT_PUBLIC_GAMING_SOCKET_URL, {
  transports: ["websocket"],
  auth: {
    token: getLocalStorageItem("access_token"),
  },
});

export const communicationSocket = io(
  process.env.NEXT_PUBLIC_COMMINICATION_SOCKET_URL,
  {
    transports: ["websocket"],
    auth: {
      token: getLocalStorageItem("access_token"),
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
