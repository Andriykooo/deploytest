"use client";

import parse from "html-react-parser";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../components/button/Button";
import Header from "../../components/header/Header";
import { Loader } from "../../components/loaders/Loader";
import { BaseLayout } from "../../layouts/baseLayout/BaseLayout";
import { setUser } from "../../store/actions";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import { removeLocalStorageItem } from "@/utils/localStorage";

const Terms = () => {
  const termsDivRef = useRef(null);
  const [terms, setTerms] = useState([]);
  const [loader, setLoader] = useState(true);
  const [termsVersion, setTermsVersion] = useState("");
  const [acceptButtonDisabled, setAcceptButtonDisabled] = useState(true);
  const user = useSelector((state) => state.user);
  const loggedUser = useSelector((state) => state.loggedUser);
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    getTerms();
  }, []);

  const getTerms = () => {
    const country = loggedUser?.user_data?.country || "US";
    setLoader(true);
    apiServices
      .get(`${apiUrl.TERMS}?country=${country}`)
      .then((res) => {
        setLoader(false);
        setTerms(res.content);
        setTermsVersion(res.version);
      })
      .catch(() => {
        setLoader(false);
      });
  };

  const continueToPrivacy = () => {
    let newUser = {};
    Object.assign(newUser, user);
    newUser["terms_version"] = termsVersion;
    dispatch(setUser(newUser));
    router.push("/privacy");
    removeLocalStorageItem("IsLogged");
  };

  const handleScroll = () => {
    const termsDiv = termsDivRef.current;
    if (
      termsDiv.scrollTop + termsDiv.clientHeight + 100 >=
      termsDiv.scrollHeight
    ) {
      setAcceptButtonDisabled(false);
    }
  };

  let pathname = usePathname();
  return (
    <BaseLayout className="backgroundImage">
      <Header />

      <div className="terms">
        <p className="termsTitleForMainPage">Terms and Conditions</p>
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

            {!loggedUser && pathname.indexOf("/terms") > "-1" ? (
              <Button
                className={
                  acceptButtonDisabled ? "acceptBtn disabled" : "acceptBtn"
                }
                onClick={continueToPrivacy}
                disabled={acceptButtonDisabled}
                text={"Accept"}
              />
            ) : (
              ""
            )}
          </>
        )}
      </div>
    </BaseLayout>
  );
};

export default Terms;
