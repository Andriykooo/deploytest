"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveSport, setLogos, setTablet } from "../../store/actions";
import { apiUrl } from "../../utils/constants";
import classNames from "classnames";
import axios from "axios";
import { CustomLink } from "../Link/Link";

export const Logo = ({ handleNavigateHome, className }) => {
  const dispatch = useDispatch();
  const isTablet = useSelector((state) => state.isTablet);
  const logos = useSelector((state) => state.logos);

  const resizeHandler = () => {
    dispatch(setTablet(window.document.documentElement.clientWidth <= 1024));
  };

  useEffect(() => {
    axios.get(apiUrl.GET_CSS_CONTENT).then((response) => {
      dispatch(setLogos(response.data));
    });

    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  return (
    logos && (
      <CustomLink href={"/"}>
        <img
          className={classNames("logo", className)}
          src={isTablet ? logos?.mobile_logo : logos?.desktop_logo}
          alt="logo"
          onClick={() => {
            handleNavigateHome?.(false);
            dispatch(setActiveSport(null));
          }}
        />
      </CustomLink>
    )
  );
};
