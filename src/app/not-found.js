import { images } from "@/utils/imagesConstant";
import Image from "next/image";
import Link from "next/link";
import arrowRight from "../assets/images/arrow_right.svg";

export default function NotFound() {
  return (
    <div className="error-page">
      <div className="header-of-error-component">
        <Link href="/home">
          <Image src={images.GroupSwifty} alt="Swifty Gaming" height={35} width={230} />
        </Link>
      </div>
      <div className="error-content">
        <div className="error-number">404</div>
        <div className="error-redirect">
          <p className="error-title">Oops!</p>
          <p className="error-description">
            That page you're looking for can't be found.
          </p>
          <div className="error-page-navigation">
            <Link href="/home">
              <button className="btnPrimary error-page-navigation-button">
                Go to Homepage
                <Image
                  src={arrowRight}
                  className="error-page-arrow"
                  height={14}
                  width={14}
                />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
