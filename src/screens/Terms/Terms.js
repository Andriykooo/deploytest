"use client";

import parse from "html-react-parser";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../components/button/Button";
import { Loader } from "../../components/loaders/Loader";
import { setUser } from "../../store/actions";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import Cookies from "js-cookie";
import { alertToast } from "@/utils/alert";
import { useTranslations } from "next-intl";
import classNames from "classnames";

const Terms = () => {
  const t = useTranslations();
  const termsDivRef = useRef(null);
  const [terms, setTerms] = useState([]);
  const [loader, setLoader] = useState(true);
  const [termsVersion, setTermsVersion] = useState("");
  const [acceptButtonDisabled, setAcceptButtonDisabled] = useState(true);
  const user = useSelector((state) => state.user);
  const loggedUser = useSelector((state) => state.loggedUser);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getTerms = () => {
    const language = Cookies.get("language") || "en";
    const country = loggedUser?.user_data?.country || "all";

    setLoader(true);
    apiServices
      .get(apiUrl.TERMS, { country, language })
      .then((res) => {
        setLoader(false);
        setTerms(res.content);
        setTermsVersion(res.version);
      })
      .catch((error) => {
        alertToast({ message: error.response.data.message });
        setLoader(false);
      });
  };

  const continueToPrivacy = () => {
    let newUser = {};
    Object.assign(newUser, user);
    newUser["terms_version"] = termsVersion;
    dispatch(setUser(newUser));
    router.push("/privacy");
  };

  const handleScroll = () => {
    const termsDiv = termsDivRef?.current;
    if (
      termsDiv?.scrollTop + termsDiv?.clientHeight + 100 >=
      termsDiv?.scrollHeight
    ) {
      setAcceptButtonDisabled(false);
    }
  };

  useEffect(() => {
    getTerms();
  }, []);

  useEffect(() => {
    if (terms) {
      handleScroll();
    }
  }, [terms]);

  const acceptIsActive = !searchParams?.get("mode");

  return (
    <div className="terms backgroundImage">
      <p className="termsTitleForMainPage">
        {t("common.terms_and_conditions")}
      </p>
      {loader ? (
        <Loader />
      ) : (
        <>
          <div
            ref={termsDivRef}
            className={
              !loggedUser && pathname.indexOf("/terms") > "-1"
                ? "termsContent termsContent-height-50"
                : "termsContent termsContent-height-60"
            }
            onScroll={handleScroll}
          >
            {parse(terms.toString())}
          </div>

          {acceptIsActive ? (
            <Button
              className={classNames("acceptBtn", {
                disabled: acceptButtonDisabled,
              })}
              onClick={continueToPrivacy}
              disabled={acceptButtonDisabled}
              text={t("common.accept")}
            />
          ) : null}
        </>
      )}
    </div>
  );
};

export default Terms;
