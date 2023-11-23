import Image from "next/image";
import { Loader } from "../../components/loaders/Loader";
import { images } from "../../utils/imagesConstant";
import { useTranslations } from "next-intl";
import { FacebookLogin } from "./Social/FacebookLogin";
import { GoogleLogin } from "./Social/GoogleLogin";
import { AppleLogin } from "./Social/AppleLogin";

export const LoginEmail = ({
  email,
  isValid,
  checkEmail,
  isLoading,
  validateEmail,
}) => {
  const t = useTranslations();

  return (
    <div className="loginForm goingBack">
      <div>
        <p className="logInTitle">{t("login.start_with_email")}</p>
        <form className="d-grid justify-content-center">
          <div className="emailValidation loginInput">
            <input
              id="email"
              type="email"
              className="login-buttons"
              placeholder={t("login.enter_email")}
              value={email}
              onChange={(e) => validateEmail(e)}
              autoFocus
            />
            {isValid && (
              <Image
                src={images.validated}
                className="validatedIcon"
                alt="Valid"
              />
            )}
          </div>
          <button
            onClick={(e) => {
              isValid && checkEmail(e);
            }}
            className={
              isValid ? "btnPrimary continueBtn validBtn " : "continueBtn"
            }
          >
            {isLoading ? <Loader /> : t("common.continue")}
          </button>
        </form>
        <p className="oneClick d-flex justify-content-center">
          {t("login.sign_in_one_click")}
        </p>
        <div className="whiteButtonsGroup d-grid">
          <AppleLogin />
          <FacebookLogin />
          <GoogleLogin />
        </div>
      </div>
    </div>
  );
};
