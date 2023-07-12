"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "../../components/button/Button";
import Header from "../../components/header/Header";
import { Loader } from "../../components/loaders/Loader";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import { CheckIcon } from "../../utils/icons";
import "../ForgotPassword/Email.css";
import { nextWindow } from "@/utils/nextWindow";

const Email = () => {
  const user = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const emailSent = () => {
    setIsLoading(true);
    let email = user?.email;
    const queryEmail = email.replace(/\+/g, "%2B").toLowerCase();
    apiServices
      .get(`${apiUrl.EMAIL_SENT}${queryEmail}`)
      .then((response) => {
        let userPasswordToken = "";
        if (response) {
          if (response?.reset_password_link) {
            if (
              response?.reset_password_link.indexOf("?user_password_token") > -1
            ) {
              userPasswordToken = response?.reset_password_link.split(
                "?user_password_token"
              )[1];
              nextWindow.location.href = `https://development.d1nqpweg93kvtk.amplifyapp.com/forgot_password?user_password_token${userPasswordToken}`;
            }
          }
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
    <>
      <Header />
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
              <Button
                className={"btnPrimary loginbuttons1"}
                onClick={() => {
                  router.push("/login");
                }}
                text={"Login"}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Email;
