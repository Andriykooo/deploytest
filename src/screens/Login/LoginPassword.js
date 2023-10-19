import Image from "next/image";
import Link from "next/link";
import { Button } from "../../components/button/Button";
import { Loader } from "../../components/loaders/Loader";
import { images } from "../../utils/imagesConstant";
import "../Login/Login.css";
import { useDispatch } from "react-redux";
import { setForgotPassword } from "@/store/actions";

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
  const dispatch = useDispatch();

  return (
    <div className="loginForm">
      <div onClick={goBack} className="go-back">
        <Image src={images.goBackArrow} alt="Go back" />
        <span>Go Back</span>
      </div>
      <h1 className="logInTitle">Welcome back, {newUser.first_name}</h1>
      <div className="justify-content-center">
        <div className="emailValidation">
          <input
            id="password"
            type={passwordShown ? "text" : "password"}
            className="login-buttons"
            placeholder="Enter your password"
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
          <Button text={"Forgot Password?"} className={"button1"} />
        </Link>
        <div className="authButtonsContainer">
          <Button
            onClick={(e) => checkPassword(e)}
            className={
              isValid ? "btnPrimary continueBtn validBtn" : "continueBtn"
            }
            text={<>{isLoading ? <Loader /> : "Sign In"}</>}
          />
        </div>
      </div>
    </div>
  );
};
