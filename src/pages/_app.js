import Head from "next/head";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createStore } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import storage from "redux-persist/lib/storage";
import { io } from "socket.io-client";
import { SocketContext } from "../context/socket";
import rootReducer from "../store/reducer";
import "../styles/globals.css";
import { CloseButton } from "../utils/alert";
import { theme } from "../utils/config";

export default function App({ Component, pageProps }) {
  const persistConfig = {
    key: "main-root",
    storage,
  };

  const [subscriptionsSocket, setSubscriptionsSocket] = useState(null);
  const [gamingSocket, setGamingSocket] = useState(null);

  const persistedReducer = persistReducer(persistConfig, rootReducer);
  const store = createStore(persistedReducer);
  const Persistor = persistStore(store);

  useEffect(() => {
    setSubscriptionsSocket(
      io(process.env.NEXT_PUBLIC_SUBSCRIPTIONS_SOCKET_URL)
    );

    setGamingSocket(
      io(process.env.NEXT_PUBLIC_GAMING_SOCKET_URL, {
        transports: ["websocket"],
      })
    );
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="Swifty Gaming" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#2b5797" />
        <meta name="theme-color" content="#ffffff" />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-iYQeCzEYFbKjA/T2uDLTpkwGzCiq6soy8tYaI1GyVh/UjpbCx/TYkiZhlZB6+fzT"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
        />
        <title>Swifty Gaming</title>
      </Head>

      <Provider store={store}>
        <PersistGate loading={null} persistor={Persistor}>
          <ToastContainer
            position="top-right"
            closeButton={CloseButton}
            autoClose={4000}
            hideProgressBar={true}
            newestOnTop={false}
            limit={2}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            toastStyle={{
              backgroundColor: theme?.colors?.mainSecondary,
              color: "white",
              fontFamily: theme?.fonts?.fontMedium,
              fontStyle: "normal",
              fontWeight: "400",
              fontSize: "1rem",
              lineHeight: "1.5rem",
              boxShadow: "0px 4px 10px rgba(14, 16, 17, 0.3)",
            }}
          />
          <SocketContext.Provider
            value={{
              gamingSocket,
              subscriptionsSocket,
            }}
          >
            <Component {...pageProps} />
          </SocketContext.Provider>
        </PersistGate>
      </Provider>
    </>
  );
}
