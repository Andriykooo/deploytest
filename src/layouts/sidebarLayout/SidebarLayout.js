"use client";

import classNames from "classnames";
import { SidebarLeft } from "../../components/sidebarLeft/SidebarLeft";
import { SidebarRight } from "../../components/sidebarRight/SidebarRight";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  const country = useSelector((state) => state.country);

  const [innerCountry, setInnerCountry] = useState("all");

  useEffect(() => {
    if (country && country !== innerCountry) {
      setInnerCountry(country);
      apiServices.get(apiUrl.GET_SIDEBAR_LEFT).then((response) => {
        dispatch(setSidebarLeft({ ...sidebarLeft, data: response }));
      });

      if (!sidebarRight.data) {
        apiServices.get(apiUrl.GET_SIDEBAR_RIGHT).then((response) => {
          dispatch(
            setSidebarRight({
              data: response,
            })
          );
        });
      }
    }
  }, [country]);

  return (
    <>
      {sidebarLeftIsActive && <SidebarLeft />}
      {<SidebarRight pageLayoutActiveStatus={sidebarRightIsActive} />}
      <div className={classNames("content", className)}>{children}</div>
    </>
  );
};
