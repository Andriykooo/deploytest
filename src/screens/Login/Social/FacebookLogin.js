import { useTranslations } from "@/hooks/useTranslations";
import { SocialButton } from "./SocialButton";
import { apiUrl } from "@/utils/constants";
import { alertToast } from "@/utils/alert";
import { useSocialLogin } from "@/hooks/useSocialLogin";
import axios from "axios";
import { useState } from "react";
import { FacebookIcon } from "@/icons/FacebookIcon";

const fbLogin = () => {
  return new Promise((resolve) => {
    window.FB.login(
      (response) => {
        resolve(response.authResponse);
      },
      {
        fields: "name,email",
        scope: "public_profile,email",
      }
    );
  });
};

export const FacebookLogin = ({ loginCallback }) => {
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false);

  const socialLogin = useSocialLogin({
    onError: () => {
      setIsLoading(false);
    },
  });

  const responseFacebook = async () => {
    try {
      const response = await fbLogin();
      setIsLoading(true);

      if (!response) {
        setIsLoading(false);
        return;
      }

      const facebookUser = await axios.get(apiUrl.GRAPH_FACEBOOK, {
        params: {
          fields: ["id", "email", "first_name", "last_name"].join(","),
          access_token: response?.accessToken,
        },
      });

      if (!facebookUser) {
        return alertToast({
          message: t("login.facebook_login_failed"),
        });
      }

      const { email, first_name, last_name } = facebookUser.data;

      await socialLogin(
        {
          email,
          social_token: response?.accessToken,
          first_name,
          last_name,
        },
        "facebook"
      );

      loginCallback?.();
    } catch (e) {
      alertToast({
        message: e.message || t("login.facebook_login_failed"),
      });
    }
  };

  return (
    <SocialButton
      icon={<FacebookIcon className="loginIconFb" />}
      text={t("login.continue_with_facebook")}
      loading={isLoading}
      loginCallback={responseFacebook}
    />
  );
};
