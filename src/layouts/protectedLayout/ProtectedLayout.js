"use client";

import { PageLoader } from "@/components/loaders/Loader";
import { useClientPathname } from "@/hooks/useClientPathname";
import { useCustomRouter } from "@/hooks/useCustomRouter";
import { setRedirectAfterLogin } from "@/store/actions";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export const ProtectedLayout = ({ children, redirect }) => {
  const dispatch = useDispatch();
  const { pathname } = useClientPathname();
  const accessToken = localStorage.getItem("access_token");
  const loggedUser = useSelector((state) => state.loggedUser);
  const router = useCustomRouter();

  useEffect(() => {
    if (!accessToken) {
      dispatch(setRedirectAfterLogin(pathname));
      router.replace(redirect);
    }
  }, [loggedUser]);

  return accessToken ? children : <PageLoader />;
};
