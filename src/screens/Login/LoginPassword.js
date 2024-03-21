import { Button } from "../../components/button/Button";
import { Loader } from "../../components/loaders/Loader";
import { useDispatch, useSelector } from "react-redux";
import { setForgotPassword } from "@/store/actions";
import { useTranslations } from "next-intl";
import { CustomLink } from "@/components/Link/Link";
import { GoBackButton } from "@/components/goBackButton/GoBackButton";
import { PasswordInput } from "@/components/PasswordInput/PasswordInput";
import "../Login/Login.css";

export const LoginPassword = ({
  newUser,
  password,
  isValid,
  checkPassword,
  isLoading,
  validatePassword,
  goBack,
}) => {
  const t = useTranslations();
  const dispatch = useDispatch();
  const isTablet = useSelector((state) => state.isTablet);

  return (
    <div className="loginForm goingBack">
      <div>
        <GoBackButton
          onClick={goBack}
          fullIcon
          className="loginBack"
          withoutText={isTablet}
        />
        <h1 className="logInTitle">
          {t("login.welcome_back")}, {newUser.first_name}
        </h1>
        <div className="justify-content-center">
          <div className="emailValidation">
            <PasswordInput
              autoFocus
              placeholder={t("login.enter_password")}
              value={password}
              onChange={(e) => validatePassword(e)}
            />
          </div>
          <CustomLink
            href="/email_sent"
            onClick={() => {
              dispatch(setForgotPassword(true));
            }}
            className={"forgotPasswordButton"}
          >
            {t("login.forgot_password")}
          </CustomLink>
        </div>
      </div>
      <div className="authButtonsContainer">
        <Button
          onClick={(e) => checkPassword(e)}
          className={
            isValid ? "btnPrimary continueBtn validBtn" : "continueBtn"
          }
          text={<>{isLoading ? <Loader /> : t("login.sign_in")}</>}
        />
      </div>
    </div>
  );
};
