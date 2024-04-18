import { useTranslations } from "@/hooks/useTranslations";
import { SocialButton } from "./SocialButton";
import { useSocialLogin } from "@/hooks/useSocialLogin";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { AppleIcon } from "@/icons/AppleIcon";

export const AppleLogin = ({ loginCallback }) => {
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false);

  const socialLogin = useSocialLogin({
    onError: () => {
      setIsLoading(false);
    },
  });

  const responseApple = async () => {
    // eslint-disable-next-line
    AppleID.auth.init({
      clientId: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID,
      scope: "name email",
      redirectURI: process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI,
      usePopup: true,
    });

    try {
      // eslint-disable-next-line
      const response = await AppleID.auth.signIn();
      const email =
        response?.user?.email ||
        jwtDecode(response?.authorization?.id_token)?.email;

      setIsLoading(true);
      await socialLogin(
        {
          email,
          social_token: response?.authorization?.id_token,
          first_name: response?.user?.name?.firstName,
          last_name: response?.user?.name?.lastName,
        },
        "apple"
      );

      loginCallback?.();
    } catch (e) {
      setIsLoading(false);
    }
  };

  return (
    <SocialButton
      icon={<AppleIcon className="loginIconFb" />}
      text={t("login.continue_with_apple")}
      loading={isLoading}
      loginCallback={responseApple}
    />
  );
};
