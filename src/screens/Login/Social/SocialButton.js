import { Loader } from "@/components/loaders/Loader";
import Image from "next/image";

export const SocialButton = ({ image, text, loginCallback, loading }) => {
  return (
    <div className="loginWhiteButtons">
      <Image
        alt="img-fbIcon"
        src={image}
        className="loginIconFb"
        height={24}
        width={24}
      />
      <div className="continueBtn white" onClick={loginCallback}>
        {loading ? (
          <Loader />
        ) : (
          <span className="social-login-title">{text}</span>
        )}
      </div>
    </div>
  );
};
