import { applyMiddleware, createStore } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import rootReducer, { initialState } from "../store/reducer";
import { composeWithDevTools } from "redux-devtools-extension";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

const createNoopStorage = () => {
  return {
    // eslint-disable-next-line
    getItem(_key) {
      return Promise.resolve(null);
    },
    // eslint-disable-next-line
    setItem(_key, value) {
      return Promise.resolve(value);
    },
    // eslint-disable-next-line
    removeItem(_key) {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

const persistConfig = {
  key: "root",
  storage,
  blacklist: [
    "sports",
    "sidebarRight",
    "sidebarLeft",
    "headerData",
    "tradingChat",
    "raceCard",
    "pageLayoutContent",
    "updatedBetslipSelections",
    "priceIsChanged",
    "subscriptions",
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
    "userStats",
    "loggedUser",
    "reviewBets",
    "updatedEvents",
    "myBets",
    "bonusesAndPromotions",
    "betIsRejected",
    "betIsAccepted",
    "redirectAfterLogin",
    "liveSelections",
    "activeSport",
    "eventsData",
    "selections",
    "selectedBetsIds",
    "providersSuspended",
  ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

let store = createStore(
  persistedReducer,
  initialState,
  composeWithDevTools(applyMiddleware())
);
let persistor = persistStore(store);

export { store, persistor };
