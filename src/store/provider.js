import { Provider } from "react-redux";
import { createStore } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import rootReducer from "../store/reducer";
import storage from "../store/storage";

export const ReduxLayout = ({ children }) => {
  const persistConfig = {
    key: "main-root",
    storage,
    blacklist: [
      "sportsData",
      "sports",
      "sidebarRight",
      "sidebarLeft",
      "headerData",
      "tradingChat",
      "raceCard",
      "pageLayoutContent",
      "updatedSelections",
      "subscriptions",
      "resultedEvents",
      "marketOptions",
      "favouriteGames",
      "currentTime",
      "footer"
    ],
  };

  const persistedReducer = persistReducer(persistConfig, rootReducer);
  const store = createStore(persistedReducer);
  const persistor = persistStore(store);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};
