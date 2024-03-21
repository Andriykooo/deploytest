"use client";

import Image from "next/image";
import classNames from "classnames";
import { images } from "../../utils/imagesConstant";
import { useState, useEffect } from "react";
import { validateUserEmail } from "@/utils/validation";
import { useDispatch, useSelector } from "react-redux";
import { apiServices } from "@/utils/apiServices";
import { apiUrl } from "@/utils/constants";
import { setPromo, setSignUpPlatform, setUser } from "@/store/actions";
import { alertToast } from "@/utils/alert";
import { v4 as uuidv4 } from "uuid";
import { Loader, PageLoader } from "@/components/loaders/Loader";
import { useTranslations } from "next-intl";
import { AppleLogin } from "../Login/Social/AppleLogin";
import { GoogleLogin } from "../Login/Social/GoogleLogin";
import { FacebookLogin } from "../Login/Social/FacebookLogin";
import { useCustomRouter } from "@/hooks/useCustomRouter";
import { Footer } from "@/components/footer/Footer";
import "../Affiliates/Affiliates.css";
import "../Login/Login.css";

const Affiliates = ({ promo }) => {
  const t = useTranslations();
  const user = useSelector((state) => state.user);
  const isMobile = useSelector((state) => state.setMobile);

  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);

  const dispatch = useDispatch();
  const router = useCustomRouter();

  const checkEmail = (e) => {
    e.preventDefault();
    setIsLoading(true);
    dispatch(setSignUpPlatform("email"));
    let device_id = uuidv4();
    const queryEmail = email.replace(/\+/g, "%2B").toLowerCase();

    apiServices
      .get(`${apiUrl.CHECK_EMAIL}?email=${queryEmail}`)
      .then((resolve) => {
        if (resolve?.email_exist) {
          if (resolve?.sign_up_platform === "email") {
            if (!resolve?.email_verified) {
              router.push("verify_email");
            }
            let newUser = {};
            Object.assign(newUser, user);
            newUser["first_name"] = resolve?.first_name;
            newUser["email"] = email;
            newUser["device_id"] = device_id;
            dispatch(setUser(newUser));
            setIsLoading(false);
            sessionStorage.setItem("loggedUserInTime", new Date());
            router.push(
              `/login?is_verfied=true&first_name=${resolve?.first_name}&email=${email}`
            );
          } else if (resolve?.sign_up_platform === "google") {
            alertToast({ message: t("affiliates.google_sign_in") });
          } else if (resolve?.sign_up_platform === "facebook") {
            alertToast({ message: t("affiliates.facebook_sign_in") });
          } else if (resolve?.sign_up_platform === "apple") {
            alertToast({ message: t("affiliates.apple_sign_in") });
          } else {
            alertToast({
              message: t("affiliates.wrong_platform"),
            });
          }
          setIsLoading(false);
        } else {
          let newUser = {};
          Object.assign(newUser, user);
          newUser["email"] = email;
          newUser["device_id"] = device_id;
          dispatch(setUser(newUser));
          router.push("/sign_up");
          setIsLoading(true);
        }
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const validateEmail = (e) => {
    setEmail(e.target.value);
    let emailExist = validateUserEmail(e.target.value);
    if (e.target.value) {
      if (emailExist) {
        setIsValid(true);
      } else {
        setIsValid(false);
      }
    } else {
      setIsValid(false);
    }
  };

  const fetchData = async () => {
    const affiliatesLinks = await apiServices.get(apiUrl.GET_AFFILIATE_LINKS);

    if (!affiliatesLinks.some((link) => link.slug === promo)) {
      router.replace("/");
      return;
    }

    dispatch(setPromo(promo));

    try {
      const landingPage = await apiServices.get(apiUrl.GET_AFFILIATES, {
        affiliate_slug: promo,
      });

      setData(landingPage);
    } catch (e) {
      router.replace("/login");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return data ? (
    <div className="affiliates">
      <div className="affiliatesBanner">
        <img
          src={isMobile ? data?.mobile_image : data?.desktop_image}
          alt="hero"
        />
      </div>
      <div className="infoForCostumers">
        <p>{data?.explainer_text}</p>
      </div>
      <div className="affiliatesRegister">
        <form className="registerNow" onSubmit={(e) => e.preventDefault()}>
          <h2 className="registerNowTitle">{t("affiliates.register_now")}</h2>
          <div className="email-validation">
            <input
              id="email"
              type="email"
              className="login-buttons emailValidation"
              placeholder={t("affiliates.enter_email")}
              value={email}
              onChange={(e) => validateEmail(e)}
              autoFocus
            />
            {isValid && images?.validated && (
              <Image
                src={images.validated}
                className="validatedIcon"
                alt="Valid"
                height={24}
                width={24}
              />
            )}
            <button
              onClick={(e) => {
                isValid && checkEmail(e);
              }}
              className={classNames("continueBtn", {
                "btnPrimary validBtn": isValid,
              })}
            >
              {isLoading ? <Loader /> : t("common.continue")}
            </button>
            <p className="oneClick d-flex justify-content-center">
              {t("affiliates.sign_in_one_click")}
            </p>
          </div>
          <div className="whiteButtonsGroup d-grid affiliatesButtons">
            <AppleLogin />
            <FacebookLogin />
            <GoogleLogin />
          </div>
        </form>
        <div className="offerWorks">
          <h2 className="offerWorksTitle">{data?.offer_header}</h2>
          <div dangerouslySetInnerHTML={{ __html: data?.offer_text }} />
        </div>
      </div>
      <div
        className="affiliatesInfo"
        dangerouslySetInnerHTML={{ __html: data?.terms }}
      />
      <Footer />
    </div>
  ) : (
    <PageLoader />
  );
};

export default Affiliates;
