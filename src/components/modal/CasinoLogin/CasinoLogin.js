import Login from "@/screens/Login/Login";
import { images } from "@/utils/imagesConstant";
import Image from "next/image";
import { useSelector } from "react-redux";
import "./CasinoLogin.css";

export const CasinoLogin = ({ onClose, bgImage }) => {
  const isMobile = useSelector((state) => state.setMobile);

  return (
    <div className="styledModalWrapper" style={{ backgroundImage: bgImage }}>
      <div
        className="modal fade show"
        id="casinoLoginModalModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        style={{ display: "block" }}
      >
        <div
          className={
            isMobile
              ? "modal-dialog modal-fullscreen"
              : "modal-dialog casino-login-dialog"
          }
        >
          <div className="modal-content">
            <Image
              src={images.closeIcon}
              className="closeIconSus"
              alt="Close"
              onClick={onClose}
            />
            <Login loginCallback={onClose} className="loginModal w-100" />
          </div>
        </div>
      </div>
    </div>
  );
};
