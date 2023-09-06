"use client";

import Header from "@/components/header/Header";
import { PageContentModal } from "@/components/pageContentModal/PageContentModal";
import ConfirmDepositLimitModal from "@/screens/DepositLimit/ConfirmDepositLimitModal";
import PrivacyConfirmModal from "@/screens/Privacy/PrivacyConfirmModal";
import GamingReminderAlert from "@/screens/RealityCheck/GamingReminder";
import TermsConfirmModal from "@/screens/Terms/TermsConfirmModal";
import { CloseButton, alertToast } from "@/utils/alert";
import { theme } from "@/utils/config";
import { addLocalStorageItem, getLocalStorageItem } from "@/utils/localStorage";
import { nextWindow } from "@/utils/nextWindow";
import { GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";
import classNames from "classnames";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  SocketContext,
  communicationSocket,
  gamingSocket,
} from "../../context/socket";
import {
  setActiveSport,
  setBetTicker,
  setCurrentTime,
  setHeaderData,
  setLoggedUser,
  setMobile,
  setOnBoardingData,
  setResultedEvents,
  setSettings,
  setSportData,
  setSportTypes,
  setTablet,
  updatePageLayoutContent,
} from "../../store/actions";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import Cookies from "js-cookie";

export const BaseLayout = ({ children, header, className }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [gamingAlert, setGamingAlert] = useState(false);
  const [privacyShowModal, setPrivacyShowModal] = useState(false);
  const [termsShowModal, setTermsShowModal] = useState(false);
  const [usageTime, setUsageTime] = useState(0);

  const loggedUser = useSelector((state) => state.loggedUser);
  const activeSport = useSelector((state) => state.activeSport);
  const settings = useSelector((state) => state.settings);

  const dispatch = useDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();

  const currentPage = header.find((page) => page.path === pathname);

  const getSportTypes = () => {
    axios.get(apiUrl.GET_SPORT_TYPES).then((result) => {
      let sportsData = result?.data;
      if (sportsData && sportsData.length > 0) {
        dispatch(setSportTypes(sportsData));
        if (!activeSport) {
          dispatch(setActiveSport(sportsData[0]?.id));
        }
      } else {
        dispatch(setSportTypes([]));
        dispatch(setActiveSport(null));
      }
    });
  };

  const getUserData = () => {
    var newUser = loggedUser;
    apiServices.get(apiUrl.USER).then((result) => {
      Cookies.set("country", result.country);

      dispatch(setLoggedUser({ ...newUser, user_data: result }));
      if (result.actions && result.actions.length > 0) {
        setShowConfirm(true);
      }
    });
  };

  const termsConditionsChanged = getLocalStorageItem("termsConditionsChanged");
  useEffect(() => {
    if (termsConditionsChanged === "true") {
      setTermsShowModal(true);
    }
  }, [termsConditionsChanged]);

  const privacyPolicyChanged = getLocalStorageItem("privacyPolicyChanged");
  useEffect(() => {
    if (privacyPolicyChanged === "true") {
      setPrivacyShowModal(true);
    }
  }, [privacyPolicyChanged]);

  useEffect(() => {
    let accessToken = getLocalStorageItem("access_token");
    if (loggedUser && accessToken) {
      getUserData();
    }

    apiServices.get(apiUrl.GET_SETTINGS).then((result) => {
      dispatch(setSettings(result));
    });

    apiServices.get(apiUrl.ON_BOARDING).then((result) => {
      dispatch(
        setOnBoardingData({
          ...result,
          languages: result.languages.map((language) => ({
            ...language,
            code2: language.code2.toUpperCase(),
          })),
        })
      );
    });

    getSportTypes();

    if (loggedUser) {
      addLocalStorageItem("swifty_id", loggedUser?.swifty_id);
    }
    dispatch(setMobile(nextWindow.document.documentElement.clientWidth <= 600));
    dispatch(
      setTablet(nextWindow.document.documentElement.clientWidth <= 1024)
    );
    dispatch(
      setSportData({
        type: "competition_id",
        value: null,
      })
    );
    dispatch(
      setSportData({
        type: "market_id",
        value: null,
      })
    );
    nextWindow.addEventListener("resize", resizeHandler);

    gamingSocket?.on("error", (response) => {
      alertToast({
        message: response.errorMessage,
      });

      if (response.errorMessage == "Page content not found") {
        router.push(pathname);
      }
    });

    communicationSocket?.on("new_event", (response) => {
      // console.log("new_event", response);
      switch (response?.type) {
        case "bet_ticker":
          dispatch(
            setBetTicker({
              status: response?.status,
              bet_referral_id: response?.bet_referral_id,
            })
          );
          break;
        case "trader_chat_disabled":
          dispatch(
            setSettings({
              ...settings,
              isTraderChatEnabled: false,
            })
          );
          break;

        case "trader_chat_enabled":
          dispatch(
            setSettings({
              ...settings,
              isTraderChatEnabled: true,
            })
          );
          break;

        case "component_updated":
          if (currentPage) {
            dispatch(
              updatePageLayoutContent({
                content: response.updatedComponent,
                slug: currentPage.slug,
              })
            );
          }
          break;
        case "event_resulted":
          dispatch(setResultedEvents(response.eventId));
          break;
        case "new_user_balance":
          // Update only user balance
          // loggedUser.user_data.balance = response.value;
          if (loggedUser && !Number.isNaN(+response.value)) {
            dispatch(
              setLoggedUser({
                ...loggedUser,
                user_data: { ...loggedUser.user_data, balance: response.value },
              })
            );
          }

          break;

        default:
          break;
      }
    });

    communicationSocket?.on("bet_referral_message", (response) => {
      // const message = `Bet ${response.bet_referral_id} - ${response.status}`;
      if (response?.status === "approved") {
        dispatch(
          setBetTicker({
            status: response?.status,
            bet_referral_id: response?.bet_referral_id,
          })
        );
      }

      if (response?.status === "rejected") {
        dispatch(
          setBetTicker({
            status: response?.status,
            bet_referral_id: response?.bet_referral_id,
          })
        );
      }

      if (response?.status === "new_offer") {
        dispatch(
          setBetTicker({
            status: response?.status,
            bet_referral_id: response?.bet_referral_id,
            bet_slip: response?.bet_slip,
          })
        );
      }
    });

    const interval = setInterval(() => {
      dispatch(setCurrentTime(new Date()));
    }, 1 * 60 * 1000);

    return () => {
      clearInterval(interval);
      nextWindow.removeEventListener("resize", resizeHandler);
    };
  }, []);

  const resizeHandler = () => {
    dispatch(setMobile(nextWindow.document.documentElement.clientWidth <= 600));
    dispatch(
      setTablet(nextWindow.document.documentElement.clientWidth <= 1024)
    );

    // show/hide bet slip based on document width
    const betSlipContainer = document.querySelector(".bet-slip-container");

    if (betSlipContainer) {
      if (nextWindow.document.documentElement.clientWidth > 1400) {
        betSlipContainer.style.display = "block";
      } else {
        betSlipContainer.style.display = "none";
      }
    }
  };

  useEffect(() => {
    let interval = null;

    if (loggedUser?.token) {
      const userRealityCheck =
        loggedUser?.user_data?.settings?.safer_gambling?.reality_check
          ?.reality_check_after;

      interval = setInterval(() => {
        setUsageTime((prev) => {
          if (userRealityCheck?.name !== "Not Set") {
            setGamingAlert(true);
          }

          return prev + userRealityCheck.value;
        });
      }, userRealityCheck.value * 60 * 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [loggedUser?.token]);

  useEffect(() => {
    dispatch(setHeaderData(header));
  }, [header]);

  const disableHeader =
    (params?.path && !header.some((page) => page.path.includes(pathname))) ||
    pathname === "/customer_service_notice";

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <SocketContext.Provider
        value={{
          gamingSocket,
          communicationSocket,
        }}
      >
        <ToastContainer
          position="top-right"
          closeButton={CloseButton}
          autoClose={4000}
          hideProgressBar={true}
          newestOnTop={false}
          limit={2}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          toastStyle={{
            backgroundColor: theme?.colors?.mainSecondary,
            color: "white",
            fontFamily: theme?.fonts?.fontMedium,
            fontStyle: "normal",
            fontWeight: "400",
            fontSize: "1rem",
            lineHeight: "1.5rem",
            boxShadow: "0px 4px 10px rgba(14, 16, 17, 0.3)",
          }}
        />
        {privacyShowModal && (
          <PrivacyConfirmModal
            privacyShowModal={privacyShowModal}
            setPrivacyShowModal={setPrivacyShowModal}
          />
        )}
        {termsShowModal && (
          <TermsConfirmModal
            termsShowModal={termsShowModal}
            setTermsShowModal={setTermsShowModal}
          />
        )}
        {gamingAlert && (
          <GamingReminderAlert
            time={usageTime}
            setGamingAlert={setGamingAlert}
          />
        )}
        {showConfirm && (
          <ConfirmDepositLimitModal
            showConfirm={showConfirm}
            setShowConfirm={setShowConfirm}
          />
        )}
        <div
          className={classNames("base-layout", className, {
            ["not-found"]: disableHeader,
          })}
        >
          <Helmet>
            <link
              rel="stylesheet"
              type="text/css"
              href="https://backoffice-dev.swifty-api.com/api/v1/settings/css/content.css"
            />
          </Helmet>
          {!disableHeader && <Header headerData={header} />}
          {children}
        </div>
        <PageContentModal />
      </SocketContext.Provider>
    </GoogleOAuthProvider>
  );
};
