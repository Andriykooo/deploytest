import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { useStore } from "./store";
import { initialState } from "./reducer";

export const ReduxLayout = ({ children }) => {
  const store = useStore(initialState);
  const persistor = persistStore(store, {}, function () {
    persistor.persist();
  });

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};
