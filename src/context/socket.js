"use client";

import { getLocalStorageItem } from "@/utils/localStorage";
import React from "react";
import { io } from "socket.io-client";

export const subscriptionsSocket = io(
  process.env.NEXT_PUBLIC_SUBSCRIPTIONS_SOCKET_URL,
  {
    reconnectionDelayMax: 15000,
  }
);

export const gamingSocket = io(process.env.NEXT_PUBLIC_GAMING_SOCKET_URL, {
  transports: ["websocket"],
  auth: {
    token: getLocalStorageItem("access_token"),
  },
});

export const communicationSocket = io(
  process.env.NEXT_PUBLIC_COMMINICATION_SOCKET_URL,
  {
    transports: ["polling"],
    auth: {
      token: getLocalStorageItem("access_token"),
    },
  }
);

export const SocketContext = React.createContext();
