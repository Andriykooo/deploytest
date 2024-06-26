"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useTranslations } from "@/hooks/useTranslations";
import { CustomLink } from "@/components/Link/Link";
import { useDispatch, useSelector } from "react-redux";
import PreferencesTitle from "@/components/preferencesTitle/PreferencesTitle";
import { apiServices } from "@/utils/apiServices";
import { setUserSettings } from "@/store/actions";
import { apiUrl } from "@/utils/constants";
import { images } from "@/utils/imagesConstant";
import { ProfileArrowIcon } from "@/icons/ProfileArrowIcon";
import "./SaferGambling.css";

export const SaferGambling = () => {
  const t = useTranslations();
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
      title: t("safer_gambling.deposit_limits"),
      link: "/settings/deposit_limit",
      desc: t("safer_gambling.deposit_limit_desc"),
    },
    {
      title: t("safer_gambling.gaming_reminders"),
      link: "/settings/reality_check",
      desc: t("safer_gambling.gaming_reminders_desc"),
    },
    {
      title: t("common.suspend_account"),
      link: "/settings/suspend_account",
      desc: t("safer_gambling.suspend_account_desc", {
        company: settings?.company_name,
      }),
    },
    {
      title: t("common.self_exclude"),
      link: "/settings/self_exclude",
      desc: t("safer_gambling.self_exclude_desc", {
        company: settings?.company_name,
      }),
    },
    {
      title: t("safer_gambling.more_information"),
      link: "/settings/safer_gambling_information",
      desc: t("safer_gambling.more_information_desc"),
    },
  ];

  return (
    <div className="pageContent-safer">
      <div className="depositLimit saferContainer">
        <PreferencesTitle
          title={t("common.safer_gambling")}
          marginBottomSize="lg"
        />
        <div className="saferDivs">
          <div>
            {saferGambling.map((row, index) => {
              return (
                <div className="infoDiv saferInfo mb-3" key={index}>
                  <CustomLink href={row.link}>
                    <p className="saferTitle">{row.title}</p>
                    {!isTablet && <p className="saferMessage">{row.desc}</p>}
                    <ProfileArrowIcon className="profileArrow" />
                  </CustomLink>
                </div>
              );
            })}
          </div>
          <div className="mb-3 yellowDiv d-flex">
            <Image
              height={50}
              width={212}
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
