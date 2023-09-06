import Image from "next/image";
import Link from "next/link";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "../../components/button/Button";
import { Loader } from "../../components/loaders/Loader";
import { images } from "../../utils/imagesConstant";
import "../Login/Login.css";

export const LoginPassword = ({
  newUser,
  passwordShown,
  password,
  isValid,
  togglePassword,
  checkPassword,
  isLoading,
  validatePassword,
}) => {
  return (
    <div className=" loginForm d-grid justify-content-center">
      <h1 className="logInTitle">Welcome back, {newUser.first_name}</h1>
      <form className="d-grid justify-content-center">
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
        <Link href="/email_sent" className={"button1"}>
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
      </form>
    </div>
  );
};
