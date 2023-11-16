import { images } from "@/utils/imagesConstant";
import { useTranslations } from "next-intl";
import { SocialButton } from "./SocialButton";
import { apiServices } from "@/utils/apiServices";
import { apiUrl } from "@/utils/constants";
import { alertToast } from "@/utils/alert";
import { useSocialLogin } from "@/hooks/useSocialLogin";
import axios from "axios";
import { useState } from "react";

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

export const FacebookLogin = () => {
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false);

  const socialLogin = useSocialLogin({
    onError: () => {
      setIsLoading(false);
    },
  });

  const responseFacebook = async () => {
    setIsLoading(true);

    try {
      const response = await fbLogin();

      if (!response) {
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
    } catch (e) {
      alertToast({
        message: e.message || t("login.facebook_login_failed"),
      });
    }
  };

  return (
    <SocialButton
      image={images.fbIcon}
      text={t("login.continue_with_facebook")}
      loading={isLoading}
      loginCallback={responseFacebook}
    />
  );
};
