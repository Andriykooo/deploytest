import { nextWindow } from "@/utils/nextWindow";
import { useSelector } from "react-redux";

const { default: useBroadcastChannel } = require("@/hooks/useBroadcastChannel");
const { useEffect, useRef } = require("react");

const AuthInitializer = ({ children }) => {
  const user = useSelector((state) => state.loggedUser);
  const loggedInRef = useRef(user ? true : false);

  const { postMessage } = useBroadcastChannel(
    "logoutChannel",
    ({ message }) => {
      if (!message) return;
      if (message === "LOGOUT") {
        nextWindow.location.reload();
      } else if (message === "LOGIN" && !loggedInRef.current) {
        nextWindow.location.reload();
      }
    }
  );

  useEffect(() => {
    if (loggedInRef.current === true && !user) {
      postMessage({ message: "LOGOUT", user });
      loggedInRef.current = false;
    } else if (user) {
      loggedInRef.current = true;
      postMessage({ message: "LOGIN", user });
    }
  }, [user]);

  return children;
};

export default AuthInitializer;
