import { Loader } from "@/components/loaders/Loader";
import React from "react";

export const SocialButton = ({ icon, text, loginCallback, loading }) => {
  return (
    <div className="loginWhiteButtons">
      {icon}
      <div className="continueBtn white" onClick={loginCallback}>
        {loading ? (
          <Loader />
        ) : (
          <span className="social-login-title">{text}</span>
        )}
      </div>
    </div>
  );
};
