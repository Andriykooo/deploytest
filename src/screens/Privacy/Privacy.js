"use client";

import { GoBackButton } from "@/components/goBackButton/GoBackButton";
import { alertToast } from "@/utils/alert";
import parse from "html-react-parser";
import { useTranslations } from "@/hooks/useTranslations";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Loader } from "../../components/loaders/Loader";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import { CloseIcon } from "@/icons/CloseIcon";
import "../Terms/Terms.css";

const Privacy = () => {
  const t = useTranslations();
  const [policy, setPolicy] = useState([]);
  const [loader, setLoader] = useState(true);
  const loggedUser = useSelector((state) => state.loggedUser);
  const isTablet = useSelector((state) => state.isTablet);
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();

  const getPolicy = () => {
    const language = params.lng;
    const country = loggedUser?.user_data?.country || "all";

    setLoader(true);
    apiServices
      .get(apiUrl.PRIVACY, { country, language })
      .then((response) => {
        setLoader(false);
        setPolicy(response.content);
      })
      .catch((error) => {
        alertToast({ message: error?.response?.data?.message });
        setLoader(false);
      });
  };

  useEffect(() => {
    getPolicy();
  }, []);

  return (
    <div className="termsContainer">
      <div className="termsAndPrivacy">
        <div className="closeDiv">
          {isTablet ? (
            <CloseIcon onClick={() => router.back()} />
          ) : (
            <GoBackButton fullIcon />
          )}
        </div>
        <p className="termsTitleForMainPage">{t("privacy.privacy_policy")}</p>
        {loader ? (
          <Loader />
        ) : (
          <>
            <div
              className={
                !loggedUser && pathname.indexOf("/privacy") > "-1"
                  ? "termsContent termsContent-height-50"
                  : "termsContent termsContent-height-60"
              }
            >
              {parse(policy.toString())}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Privacy;
