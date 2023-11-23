"use client";

import classNames from "classnames";
import { SidebarLeft } from "../../components/sidebarLeft/SidebarLeft";
import { SidebarRight } from "../../components/sidebarRight/SidebarRight";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { apiServices } from "@/utils/apiServices";
import { apiUrl } from "@/utils/constants";
import { setSidebarLeft, setSidebarRight } from "@/store/actions";
import { useParams } from "next/navigation";

export const SidebarLayout = ({
  sidebarLeftIsActive,
  sidebarRightIsActive,
  children,
  className,
}) => {
  const dispatch = useDispatch();
  const params = useParams();
  const sidebarLeft = useSelector((state) => state.sidebarLeft);
  const sidebarRight = useSelector((state) => state.sidebarRight);
  const loggedUser = useSelector((state) => state.loggedUser);
  const settings = useSelector((state) => state.settings);

  useEffect(() => {
    apiServices
      .get(apiUrl.GET_SIDEBAR_LEFT, {
        country:
          loggedUser?.user_data?.country?.toLowerCase() ||
          settings?.country?.toLowerCase() ||
          "all",
      })
      .then((response) => {
        dispatch(setSidebarLeft({ ...sidebarLeft, data: response }));
      });

    if (!sidebarRight.data) {
      const contentLanguage = params.lng === "en" ? "all" : params.lng;

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
      {<SidebarRight pageLayoutActiveStatus={sidebarRightIsActive} />}
      <div className={classNames("content", className)}>{children}</div>
    </>
  );
};
