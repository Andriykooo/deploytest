import { Provider } from "react-redux";
import { createStore } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import rootReducer from "../store/reducer";
import storage from "../store/storage";
import { composeWithDevTools } from "redux-devtools-extension";

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
      "footer",
      "errorCode",
    ],
  };

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  const store = createStore(persistedReducer, composeWithDevTools());

  const persistor = persistStore(store);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};
