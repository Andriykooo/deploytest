"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader } from "../../components/loaders/Loader";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import { CheckIcon } from "../../utils/icons";
import { redirect } from "next/navigation";
import { setForgotPassword } from "@/store/actions";
import "../ForgotPassword/Email.css";
import { useTranslations } from "next-intl";
const Email = () => {
  const t = useTranslations("email_sent");
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const forgotPassword = useSelector((state) => state.forgotPassword);
  const [isLoading, setIsLoading] = useState(true);

  const emailSent = () => {
    setIsLoading(true);
    const queryEmail = user?.email?.replace(/\+/g, "%2B").toLowerCase();

    apiServices.get(`${apiUrl.EMAIL_SENT}${queryEmail}`).finally(() => {
      setIsLoading(false);
    });
  };

  useEffect(() => {
    if (user?.email && forgotPassword) {
      emailSent();
    } else {
      redirect("/login");
    }

    return () => {
      dispatch(setForgotPassword(false));
    };
  }, []);

  return (
    <div className="backgroundImage">
      <div className="email-sent-container">
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <CheckIcon />
            <p className="logInTitlee">{t("email_sent")}</p>
            <p className="paragraphh">
              {t("check_inbox_open_link_to_continue")}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Email;
