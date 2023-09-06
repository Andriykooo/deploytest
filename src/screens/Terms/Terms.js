"use client";

import { removeLocalStorageItem } from "@/utils/localStorage";
import parse from "html-react-parser";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../components/button/Button";
import { Loader } from "../../components/loaders/Loader";
import { setUser } from "../../store/actions";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import Cookies from "js-cookie";
import { alertToast } from "@/utils/alert";

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
  const pathname = usePathname();

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
    removeLocalStorageItem("IsLogged");
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

  return (
    <div className="terms backgroundImage">
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

          {user && !loggedUser && pathname.indexOf("/terms") > "-1" ? (
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
  );
};

export default Terms;
