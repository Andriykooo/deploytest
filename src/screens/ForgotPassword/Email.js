"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { Loader } from "../../components/loaders/Loader";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import { CheckIcon } from "../../utils/icons";
import "../ForgotPassword/Email.css";

const Email = () => {
  const user = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(true);

  const emailSent = () => {
    setIsLoading(true);
    let email = user?.email;
    const queryEmail = email.replace(/\+/g, "%2B").toLowerCase();
    apiServices
      .get(`${apiUrl.EMAIL_SENT}${queryEmail}`)
      .then((response) => {
        if (
          response &&
          response?.reset_password_link?.indexOf("?user_password_token") > -1
        ) {
          setUserPasswordToken(
            response?.reset_password_link.split("?user_password_token")[1]
          );
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    emailSent();
  }, []);

  return (
    <div className="backgroundImage">
      <div className="email-sent-container loginForm">
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <CheckIcon />
            <p className="logInTitlee">E-mail sent</p>
            <p className="paragraphh">
              Check your inbox and open the link we sent to continue
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Email;
