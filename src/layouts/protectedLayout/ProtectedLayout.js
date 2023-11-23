"use client";

import { PageLoader } from "@/components/loaders/Loader";
import { useCustomRouter } from "@/hooks/useCustomRouter";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export const ProtectedLayout = ({ children }) => {
  const accessToken = localStorage.getItem("access_token");
  const loggedUser = useSelector((state) => state.loggedUser);
  const router = useCustomRouter();

  useEffect(() => {
    if (!accessToken) {
      router.replace("/");
    }
  }, [loggedUser]);

  return accessToken ? children : <PageLoader />;
};
