"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveSport } from "../../store/actions";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import classNames from "classnames";

export const Logo = ({ handleNavigateHome, className }) => {
  const dispatch = useDispatch();
  const isTablet = useSelector((state) => state.isTablet);

  const [logo, setLogo] = useState(null);

  useEffect(() => {
    apiServices.get(apiUrl.GET_CSS_CONTENT).then((response) => {
      setLogo(response);
    });
  }, []);

  return (
    logo && (
      <Link href={"/"}>
        <img
          className={classNames(className)}
          src={isTablet ? logo?.mobile_logo : logo?.desktop_logo}
          alt="logo"
          onClick={() => {
            handleNavigateHome?.(false);
            dispatch(setActiveSport("0"));
          }}
        />
      </Link>
    )
  );
};
