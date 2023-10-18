"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserSettings } from "../../store/actions";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import { images } from "../../utils/imagesConstant";
import "../Profile/Profile.css";
import "../SaferGambling/SaferGambling.css";
import "../Withdraw/Withdraw.css";
import PreferencesTitle from "@/components/preferencesTitle/PreferencesTitle";
import { useClientTranslation } from "@/app/i18n/client";

export const SaferGambling = () => {
  const { t } = useClientTranslation(["safer_gambling", "common"]);
  const dispatch = useDispatch();
  const isTablet = useSelector((state) => state.isTablet);
  const settings = useSelector((state) => state.settings);

  useEffect(() => {
    apiServices.get(apiUrl.SETTING_OPTIONS).then((response) => {
      dispatch(setUserSettings(response));
    });
  }, []);

  const saferGambling = [
    {
      title: t("deposit_limits"),
      link: "/profile/deposit_limit",
      desc: t("deposit_limit_desc"),
    },
    {
      title: t("gaming_reminders"),
      link: "/profile/reality_check",
      desc: t("gaming_reminders_desc"),
    },
    {
      title: t("common:suspend_account"),
      link: "/profile/suspend_account",
      desc: t("suspend_account_desc", { company: settings?.companyName }),
    },
    {
      title: t("common:self_exclude"),
      link: "/profile/self_exclude",
      desc: t("self_exclude_desc", { company: settings?.companyName }),
    },
    {
      title: t("more_information"),
      link: "/profile/safer_gambling_information",
      desc: t("more_information_desc"),
    },
  ];

  return (
    <div className="pageContent-safer">
      <div className="depositLimit saferContainer">
        <PreferencesTitle
          title={t("common:safer_gambling")}
          marginBottomSize="lg"
        />
        <div className="saferDivs">
          <div>
            {saferGambling.map((row, index) => {
              return (
                <div className="infoDiv saferInfo mb-3" key={index}>
                  <Link href={row.link}>
                    <p className="saferTitle">{row.title}</p>
                    {!isTablet && <p className="saferMessage">{row.desc}</p>}
                    <Image
                      alt="img-arrowIcon"
                      src={images.arrowIcon}
                      className="profileArrow"
                    />
                  </Link>
                </div>
              );
            })}
          </div>
          <div className="mb-3 yellowDiv d-flex">
            <Image
              src={images.whenTheFun}
              alt="Safer Gambling"
              className="m-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
