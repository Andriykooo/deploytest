"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveSport, setLogos } from "../../store/actions";
import { apiUrl } from "../../utils/constants";
import classNames from "classnames";
import axios from "axios";

export const Logo = ({ handleNavigateHome, className }) => {
  const dispatch = useDispatch();
  const isTablet = useSelector((state) => state.isTablet);
  const logos = useSelector((state) => state.logos);

  useEffect(() => {
    axios.get(apiUrl.GET_CSS_CONTENT).then((response) => {
      dispatch(setLogos(response.data));
    });
  }, []);

  return (
    logos && (
      <Link href={"/"}>
        <img
          className={classNames(className)}
          src={isTablet ? logos?.mobile_logo : logos?.desktop_logo}
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
