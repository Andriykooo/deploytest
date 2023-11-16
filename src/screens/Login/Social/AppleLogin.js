import { images } from "@/utils/imagesConstant";
import { useTranslations } from "next-intl";
import { SocialButton } from "./SocialButton";
import { appleAuthHelpers } from "react-apple-signin-auth";
import { useSocialLogin } from "@/hooks/useSocialLogin";
import { useState } from "react";

export const AppleLogin = () => {
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false);

  const socialLogin = useSocialLogin({
    onError: () => {
      setIsLoading(false);
    },
  });

  const responseApple = () => {
    appleAuthHelpers.signIn({
      authOptions: {
        clientId: "com.web.swiftygaming.development",
        redirectURI: "https://gaming-dev.devswiftyglobal.com/apple_callback",
        scope: "email name",
        state: "state",
        nonce: "nonce",
        usePopup: true,
      },
      onError: () => {
        setIsLoading(false);
      },
      onSuccess: async (response) => {
        setIsLoading(true);
        await socialLogin(
          {
            email: response?.user?.email,
            social_token: response?.authorization?.id_token,
            first_name: response?.user?.name?.firstName,
            last_name: response?.user?.name?.lastName,
          },
          "apple"
        );
      },
      onError: (error) => console.error(error),
    });
  };

  return (
    <SocialButton
      image={images.apple}
      text={t("login.continue_with_apple")}
      loading={isLoading}
      loginCallback={responseApple}
    />
  );
};
