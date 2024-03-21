import { useEffect, useState } from "react";

export const useInternetStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const handleOnlineStatusChange = () => {
    setIsOnline(navigator.onLine);
  };

  useEffect(() => {
    window.addEventListener("online", handleOnlineStatusChange);
    window.addEventListener("offline", handleOnlineStatusChange);

    return () => {
      window.removeEventListener("online", handleOnlineStatusChange);
      window.removeEventListener("offline", handleOnlineStatusChange);
    };
  }, []);

  return isOnline;
};
