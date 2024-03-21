import Login from "@/screens/Login/Login";
import { images } from "@/utils/imagesConstant";
import Image from "next/image";
import { useSelector } from "react-redux";
import "./CasinoLogin.css";

export const CasinoLogin = ({ onClose, onLogin, bgImage }) => {
  const isMobile = useSelector((state) => state.setMobile);

  return (
    <div className="casino-login-wrapper" style={{ backgroundImage: bgImage }}>
      <div
        className="modal show"
        id="casinoLoginModalModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        style={{ display: "block" }}
      >
        <div
          className={`modal-dialog ${
            isMobile ? "modal-fullscreen" : "casino-login-dialog"
          }`}
        >
          <div className="modal-content">
            <Image
              height={24}
              width={24}
              src={images.closeIcon}
              className="closeIconSus"
              alt="Close"
              onClick={onClose}
            />
            <Login
              loginCallback={onLogin}
              className="loginModal w-100"
              disableRedirect
            />
          </div>
        </div>
      </div>
    </div>
  );
};
