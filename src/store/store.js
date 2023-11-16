import { applyMiddleware, createStore } from "redux";
import { persistReducer } from "redux-persist";
import rootReducer from "../store/reducer";
import { composeWithDevTools } from "redux-devtools-extension";
import { useMemo } from "react";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

const createNoopStorage = () => {
  return {
    getItem(_key) {
      return Promise.resolve(null);
    },
    setItem(_key, value) {
      return Promise.resolve(value);
    },
    removeItem(_key) {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

let store;

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
    "updatedBetslipSelections",
    "priceIsChanged",
    "subscriptions",
    "resultedEvents",
    "marketOptions",
    "favouriteGames",
    "currentTime",
    "footer",
    "alertModal",
    "privacyModal",
    "termsModal",
    "forgotPassword",
    "tooltip",
    "isVerifyMessage",
    "sportContent",
    "userStats"
  ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

function makeStore(initialState = exampleInitialState) {
  return createStore(
    persistedReducer,
    initialState,
    composeWithDevTools(applyMiddleware())
  );
}

export const initializeStore = (preloadedState) => {
  let _store = store ?? makeStore(preloadedState);

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = makeStore({
      ...store.getState(),
      ...preloadedState,
    });
    // Reset the current store
    store = undefined;
  }

  // For SSG and SSR always create a new store
  if (typeof window === "undefined") return _store;
  // Create the store once in the client
  if (!store) store = _store;

  return _store;
};

export function useStore(initialState) {
  const store = useMemo(() => initializeStore(initialState), [initialState]);
  return store;
}
