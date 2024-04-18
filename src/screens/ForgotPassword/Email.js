"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PageLoader } from "../../components/loaders/Loader";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import { CheckIcon } from "@/icons/CheckIcon";
import { setForgotPassword } from "@/store/actions";
import { useTranslations } from "@/hooks/useTranslations";
import { Button } from "@/components/button/Button";
import { useCustomRouter } from "@/hooks/useCustomRouter";
import "../ForgotPassword/Email.css";

const Email = () => {
  const t = useTranslations();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const forgotPassword = useSelector((state) => state.forgotPassword);
  const isTablet = useSelector((state) => state.isTablet);
  const [isLoading, setIsLoading] = useState(true);
  const router = useCustomRouter();

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
      router.push("/login");
    }

    return () => {
      dispatch(setForgotPassword(false));
    };
  }, []);

  return (
    <div className="signInImage">
      {isLoading ? (
        <PageLoader />
      ) : (
        <div className="email-sent-container">
          <div className="email-sent-message">
            <CheckIcon />
            <p className="logInTitlee">{t("email_sent.email_sent")}</p>
            <p className="paragraphh">
              {t("email_sent.check_inbox_open_link_to_continue")}
            </p>
          </div>
          {isTablet && (
            <div className="authButtonsContainer">
              <Button
                onClick={() => router.back()}
                className="closeBtn"
                text={t("common.cancel")}
              />
              <Button
                className="btnPrimary continueBtn validBtn"
                text={t("email_sent.open_email_app")}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Email;
