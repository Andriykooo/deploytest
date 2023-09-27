import Image from "next/image";
import Link from "next/link";
import { Button } from "../../components/button/Button";
import { Loader } from "../../components/loaders/Loader";
import { images } from "../../utils/imagesConstant";
import "../Login/Login.css";
import { useDispatch } from "react-redux";
import { setForgotPassword } from "@/store/actions";
import { useClientTranslation } from "@/app/i18n/client";

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
  const { t } = useClientTranslation(["login", "common"])
  const dispatch = useDispatch();

  return (
    <div className="loginForm">
      <div onClick={goBack} className="go-back">
        <Image src={images.goBackArrow} alt="Go back" />
        <span>{t("common:go_back")}</span>
      </div>
      <h1 className="logInTitle">{t("welcome_back")}, {newUser.first_name}</h1>
      <div className="justify-content-center">
        <div className="emailValidation">
          <input
            id="password"
            type={passwordShown ? "text" : "password"}
            className="login-buttons"
            placeholder={t("enter_password")}
            value={password}
            onChange={(e) => validatePassword(e)}
            autoFocus
          />
          {isValid && (
            <Image
              src={images.showPassIcon}
              onClick={togglePassword}
              className="showPasswordIconBtm welcome"
              alt="Show password"
              width={20}
              height={14}
            />
          )}
        </div>
        <Link
          href="/email_sent"
          onClick={() => {
            dispatch(setForgotPassword(true));
          }}
          className={"button1"}
        >
          <Button text={t("forgot_password")} className={"button1"} />
        </Link>
        <div className="authButtonsContainer">
          <Button
            onClick={(e) => checkPassword(e)}
            className={
              isValid ? "btnPrimary continueBtn validBtn" : "continueBtn"
            }
            text={<>{isLoading ? <Loader /> : t("sign_in")}</>}
          />
        </div>
      </div>
    </div>
  );
};
