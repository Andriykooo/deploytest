"use client";

import { images } from "@/utils/imagesConstant";
import Image from "next/image";
import Link from "next/link";
import arrowRight from "../../assets/images/arrow_right.svg";
import { Montserrat } from "next/font/google";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import { useLayoutEffect } from "react";
import { useClientTranslation } from "@/app/i18n/client";

const montserrat = Montserrat({
  subsets: ["latin"],
  style: "normal",
});

export const NotFoundScreen = () => {
  const { t } = useClientTranslation("not_found");
  const router = useRouter();

  useLayoutEffect(() => {
    router.replace("/not_found");
  }, []);

  return (
    <div className={classNames("error-page", montserrat.className)}>
      <div className="header-of-error-component">
        <Link href="/">
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
          <p className="error-title">{t("oops_exclamation")}</p>
          <p className="error-description">
            {t("page_not_found")}
          </p>
          <div className="error-page-navigation">
            <Link href="/">
              <button className="btnPrimary error-page-navigation-button">
                {t("go_to_homepage")}
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
