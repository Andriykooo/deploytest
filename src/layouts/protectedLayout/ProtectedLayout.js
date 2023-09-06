"use client";

import { PageLoader } from "@/components/loaders/Loader";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export const ProtectedLayout = ({ children }) => {
  const accessToken = localStorage.getItem("access_token");
  const loggedUser = useSelector((state) => state.loggedUser);

  useEffect(() => {
    if (!accessToken) {
      redirect("/login");
    }
  }, [loggedUser]);

  return accessToken ? children : <PageLoader />;
};
