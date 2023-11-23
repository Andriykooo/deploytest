import Image from "next/image";
import Link from "next/link";
import { Button } from "../../components/button/Button";
import { Loader } from "../../components/loaders/Loader";
import { images } from "../../utils/imagesConstant";
import "../Login/Login.css";
import { useDispatch, useSelector } from "react-redux";
import { setForgotPassword } from "@/store/actions";
import { useTranslations } from "next-intl";
import { CustomLink } from "@/components/Link/Link";
import { GoBackButton } from "@/components/goBackButton/GoBackButton";
export const LoginPassword = ({
  newUser,
  passwordShown,
  password,
  isValid,
  togglePassword,
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
        {!isTablet && <GoBackButton fullIcon className="loginBack" />}
        <h1 className="logInTitle">
          {t("login.welcome_back")}, {newUser.first_name}
        </h1>
        <div className="justify-content-center">
          <div className="emailValidation">
            <div className="signUpPassword">
              <input
                id="password"
                type={passwordShown || !isValid ? "text" : "password"}
                className="login-buttons mb-0"
                placeholder={t("login.enter_password")}
                value={password}
                onChange={(e) => validatePassword(e)}
                autoFocus
              />
              {isValid && (
                <Image
                  src={images.showPassIcon}
                  onClick={togglePassword}
                  className="showPasswordIcon welcome"
                  alt="Show password"
                  width={20}
                  height={14}
                />
              )}
            </div>
          </div>
          <CustomLink
            href="/email_sent"
            onClick={() => {
              dispatch(setForgotPassword(true));
            }}
            className={"button1"}
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
