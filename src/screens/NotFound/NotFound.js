"use client";

import { images } from "@/utils/imagesConstant";
import Image from "next/image";
import Link from "next/link";
import arrowRight from "../../assets/images/arrow_right.svg";
import { Montserrat } from "next/font/google";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import { useLayoutEffect } from "react";

const montserrat = Montserrat({
  subsets: ["latin"],
  style: "normal",
});

export const NotFoundScreen = () => {
  const router = useRouter();

  useLayoutEffect(() => {
    router.replace("/not_found");
  }, []);

  return (
    <div className={classNames("error-page", montserrat.className)}>
      <div className="header-of-error-component">
        <Link href="/home">
          <Image
            src={images.GroupSwifty}
            alt="Swifty Gaming"
            height={35}
            width={230}
          />
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
                  alt="arrow"
                />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
