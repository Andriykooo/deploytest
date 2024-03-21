import { Loader } from "../../components/loaders/Loader";
import { useTranslations } from "next-intl";
import { FacebookLogin } from "./Social/FacebookLogin";
import { GoogleLogin } from "./Social/GoogleLogin";
import { AppleLogin } from "./Social/AppleLogin";
import { LegalAge } from "@/utils/icons";
import classNames from "classnames";
import { useSelector } from "react-redux";
import { ValidIcon } from "@/utils/icons";

export const LoginEmail = ({
  email,
  isValid,
  checkEmail,
  isLoading,
  validateEmail,
  loginCallback,
}) => {
  const t = useTranslations();
  const isTablet = useSelector((state) => state.isTablet);

  return (
    <div
      className={classNames("loginForm goingBack", {
        "login-container": !isTablet,
      })}
    >
      <div className="loginForm-content">
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
            {isValid && <ValidIcon className="validatedIcon" alt="Valid" />}
          </div>
          <button
            onClick={(e) => {
              isValid && checkEmail(e);
            }}
            className={
              isValid
                ? "btnPrimary continueBtn validBtn "
                : "continueBtn pe-none"
            }
          >
            {isLoading ? <Loader /> : t("common.continue")}
          </button>
        </form>
        <p className="oneClick d-flex justify-content-center">
          {t("login.sign_in_one_click")}
        </p>
        <div className="whiteButtonsGroup d-grid">
          <AppleLogin loginCallback={loginCallback} />
          <FacebookLogin loginCallback={loginCallback} />
          <GoogleLogin loginCallback={loginCallback} />
        </div>
        <div
          className={classNames("w-100 d-flex align-items-end", {
            "h-100": !isTablet,
          })}
        >
          <LegalAge className="legal-age" text={t("login.legal_age_text")} />
        </div>
      </div>
    </div>
  );
};
