"use client";

import classNames from "classnames";
import { SidebarLeft } from "../../components/sidebarLeft/SidebarLeft";
import { SidebarRight } from "../../components/sidebarRight/SidebarRight";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { apiServices } from "@/utils/apiServices";
import { apiUrl } from "@/utils/constants";
import { setSidebarLeft, setSidebarRight } from "@/store/actions";

export const SidebarLayout = ({
  sidebarLeftIsActive,
  sidebarRightIsActive,
  children,
  className,
}) => {
  const dispatch = useDispatch();
  const sidebarLeft = useSelector((state) => state.sidebarLeft);
  const sidebarRight = useSelector((state) => state.sidebarRight);
  const loggedUser = useSelector((state) => state.loggedUser);

  useEffect(() => {
    const lang = Cookies.get("language");

    apiServices
      .get(apiUrl.GET_SIDEBAR_LEFT, {
        country: loggedUser?.user_data?.country?.toLowerCase() || "all",
      })
      .then((response) => {
        dispatch(setSidebarLeft({ ...sidebarLeft, data: response }));
      });

    if (!sidebarRight.data) {
      const contentLanguage = lang === "en" ? "all" : lang;

      apiServices
        .get(apiUrl.GET_SIDEBAR_RIGHT, { country: contentLanguage })
        .then((response) => {
          dispatch(
            setSidebarRight({
              data: response,
            })
          );
        });
    }
  }, []);

  return (
    <>
      {sidebarLeftIsActive && <SidebarLeft />}
      {sidebarRightIsActive && <SidebarRight />}
      <div className={classNames("content", className)}>{children}</div>
    </>
  );
};
