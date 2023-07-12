import "react-toastify/dist/ReactToastify.css";
import { Button } from "../../components/button/Button";
import { Loader } from "../../components/loaders/Loader";
import { images } from "../../utils/imagesConstant";
import "../Login/Login.css";
import Image from "next/image";
// prettier-ignore

export const LoginPassword = ({newUser, passwordShown, password, isValid, togglePassword, verifyLink, checkPassword, isLoading, validatePassword}) => {
    return(
        <div className=" loginForm d-grid justify-content-center">
            <h1 className="logInTitle">
                Welcome back, {newUser.first_name}
            </h1>
            <form
                className="d-grid justify-content-center"
            >
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
                        />
                    )}
                </div>
                <Button className={"button1"} onClick={verifyLink} text={"Forgot Password?"}/>
                <Button
                    onClick={(e)=> checkPassword(e)
                }
                    className={isValid ? "btnPrimary continueBtn validBtn " : "continueBtn"}
                    disabled={isValid ? false: true}
                    text={
                        <>
                    {
                    isLoading ? <Loader/> : "Sign In"
                    }
                        </>
                    }
                />
            </form>
      </div>
    )
}
