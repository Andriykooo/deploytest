import { useTranslations } from "next-intl";
import { SocialButton } from "./SocialButton";
import { apiUrl } from "@/utils/constants";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useSocialLogin } from "@/hooks/useSocialLogin";
import { useState } from "react";
import { alertToast } from "@/utils/alert";
import { GoogleIcon } from "@/utils/icons";

export const GoogleLogin = ({ loginCallback }) => {
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false);

  const socialLogin = useSocialLogin({
    onError: () => {
      setIsLoading(false);
    },
  });

  const responseGoogle = useGoogleLogin({
    onError: () => {
      setIsLoading(false);
    },
    onSuccess: async (response) => {
      setIsLoading(true);

      const googleResponse = await axios.get(apiUrl.GOOGLE_OAUTH_USERINFO, {
        headers: {
          Authorization: `Bearer ${response.access_token}`,
        },
      });

      if (!googleResponse) {
        return alertToast({
          message: t("login.google_login_failed"),
        });
      }

      const { email, given_name, family_name } = googleResponse.data;

      await socialLogin(
        {
          email,
          social_token: response?.access_token,
          first_name: given_name,
          last_name: family_name,
        },
        "google"
      );

      loginCallback?.();
    },
    scope: "email profile",
    flow: "implicit",
  });

  return (
    <SocialButton
      icon={<GoogleIcon className="loginIconFb"/>}
      text={t("login.continue_with_google")}
      loading={isLoading}
      loginCallback={responseGoogle}
    />
  );
};
