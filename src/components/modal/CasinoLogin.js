import Login from "@/screens/Login/Login";
import { images } from "@/utils/imagesConstant";
import Image from "next/image";
import { useSelector } from "react-redux";
import styled from "styled-components";

const StyledModalWrapper = styled.div`
  position: fixed;
  left: 0;
  top: 74px;
  right: 0;
  bottom: 0;
  ${({ bgImage }) => `background-image: url("${bgImage}")`};
  background-size: cover;
  background-position: center;
  z-index: 1055;
`;

export const CasinoLogin = ({ onClose, bgImage }) => {
  const isMobile = useSelector((state) => state.setMobile);

  return (
    <StyledModalWrapper bgImage={bgImage}>
      <div
        className="modal fade show"
        id="casinoLoginModalModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        style={{ display: "block" }}
      >
        <div
          className={isMobile ? "modal-dialog modal-fullscreen" : "modal-dialog casino-login-dialog"}
        >
          <div className="modal-content">
            <Image
              src={images.closeIcon}
              className="closeIconSus"
              alt="Close"
              onClick={onClose}
            />
            <Login loginCallback={onClose} />
          </div>
        </div>
      </div>
    </StyledModalWrapper>
  );
};
