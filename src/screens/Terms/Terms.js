"use client";

import { GoBackButton } from "@/components/goBackButton/GoBackButton";
import { alertToast } from "@/utils/alert";
import parse from "html-react-parser";
import { useTranslations } from "next-intl";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Loader } from "../../components/loaders/Loader";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import { CloseIcon } from "@/utils/icons";

const Terms = () => {
  const t = useTranslations();
  const [terms, setTerms] = useState([]);
  const [loader, setLoader] = useState(true);
  const loggedUser = useSelector((state) => state.loggedUser);
  const isTablet = useSelector((state) => state.isTablet);
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();

  const getTerms = () => {
    const language = params.lng;
    const country = loggedUser?.user_data?.country || "all";

    setLoader(true);
    apiServices
      .get(apiUrl.TERMS, { country, language })
      .then((res) => {
        setLoader(false);
        setTerms(res.content);
      })
      .catch((error) => {
        alertToast({ message: error.response.data.message });
        setLoader(false);
      });
  };

  useEffect(() => {
    getTerms();
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
        <p className="termsTitleForMainPage">
          {t("common.terms_and_conditions")}
        </p>
        {loader ? (
          <Loader />
        ) : (
          <>
            <div
              className={
                !loggedUser && pathname.indexOf("/terms") > "-1"
                  ? "termsContent termsContent-height-50"
                  : "termsContent termsContent-height-60"
              }
            >
              {parse(terms.toString())}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Terms;
