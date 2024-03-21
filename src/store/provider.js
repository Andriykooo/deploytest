"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store";
import AuthInitializer from "@/components/Auth/AuthInitializer";

export const ReduxLayout = ({ children }) => {
  return (
    <Provider store={store}>
      <AuthInitializer>
        <PersistGate loading={null} persistor={persistor}>
          {children}
        </PersistGate>
      </AuthInitializer>
    </Provider>
  );
};
