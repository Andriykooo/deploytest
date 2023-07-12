"use client";

import Header from "@/components/header/Header";
import { PageContentModal } from "@/components/pageContentModal/PageContentModal";
import ConfirmDepositLimitModal from "@/screens/DepositLimit/ConfirmDepositLimitModal";
import PrivacyConfirmModal from "@/screens/Privacy/PrivacyConfirmModal";
import GamingReminderAlert from "@/screens/RealityCheck/GamingReminder";
import TermsConfirmModal from "@/screens/Terms/TermsConfirmModal";
import { CloseButton, SuccesToast, alertToast } from "@/utils/alert";
import { theme } from "@/utils/config";
import { addLocalStorageItem, getLocalStorageItem } from "@/utils/localStorage";
import { nextWindow } from "@/utils/nextWindow";
import { GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";
import classNames from "classnames";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from "uuid";
import {
  SocketContext,
  communicationSocket,
  gamingSocket,
  subscriptionsSocket,
} from "../../context/socket";
import {
  setActiveSocketSubscribe,
  setActiveSport,
  setBetTicker,
  setLoggedUser,
  setMobile,
  setOnBoardingData,
  setSportData,
  setSportTypes,
  setTablet,
} from "../../store/actions";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import {
  unsubscribeToCompetition,
  unsubscribeToMarket,
  unsubscribeToMatch,
  unsubscribeToSport,
} from "../../utils/socketSubscribers";

export const BaseLayout = ({ children, header, className }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [gamingAlert, setGamingAlert] = useState(false);
  const [privacyShowModal, setPrivacyShowModal] = useState(false);
  const [termsShowModal, setTermsShowModal] = useState(false);

  const loggedUser = useSelector((state) => state.loggedUser);
  const activeSport = useSelector((state) => state.activeSport);
  const activeSocketSubscribe = useSelector(
    (state) => state.activeSocketSubscribe
  );
  const inPlay = useSelector((state) => state.inPlay);
  const sportData = useSelector((state) => state.sportsData);

  const [usageTime, setUsageTime] = useState(null);
  const [realityGamingReminder, setRealityGamingReminder] = useState("");

  const dispatch = useDispatch();
  const pathname = usePathname();
  const uuid = uuidv4();

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
      newUser.user_data = result;
      dispatch(setLoggedUser(newUser));
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
    apiServices.get(apiUrl.ON_BOARDING).then((result) => {
      dispatch(
        setOnBoardingData({
          ...result,
          languages: result.languages.map((language) => ({
            ...language,
            code2:
              language.language_name === "English"
                ? "all"
                : language.code2.toUpperCase(),
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
    });

    communicationSocket?.on("new_event", (response) => {
      console.log("new_event");
      switch (response?.type) {
        case "bet_ticker":
          dispatch(
            setBetTicker({
              status: response?.status,
              bet_referral_id: response?.bet_referral_id,
            })
          );
          break;
        default:
          console.log("new_event", response);
          SuccesToast({
            message: response?.message,
          });
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
    });

    return () => nextWindow.removeEventListener("resize", resizeHandler);
  }, []);

  useEffect(() => {
    let pathName = pathname;
    let checkPath =
      pathName.indexOf("/inplay") > -1 ||
      (pathName.indexOf("/match") > -1 && inPlay);
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
    if (pathName !== "/login") {
      if (pathName !== "/casino") {
        addLocalStorageItem("nextUrlPath", "other");
      }
    }
    if (!checkPath) {
      if (activeSocketSubscribe) {
        subscriptionsSocket.on("connect", () => {
          if (activeSocketSubscribe === "SUBSCRIBE_SPORT" && activeSport) {
            unsubscribeToSport(
              subscriptionsSocket,
              activeSport.toString(),
              uuid
            );
          } else if (
            activeSocketSubscribe === "SUBSCRIBE_MATCH" &&
            sportData?.match_id
          ) {
            unsubscribeToMatch(
              subscriptionsSocket,
              sportData?.match_id.toString(),
              uuid
            );
          } else if (
            activeSocketSubscribe === "SUBSCRIBE_MARKET" &&
            sportData?.market_id
          ) {
            unsubscribeToMarket(
              subscriptionsSocket,
              sportData?.market_id.toString(),
              uuid
            );
          } else if (
            activeSocketSubscribe === "SUBSCRIBE_COMPETITION" &&
            sportData?.competition_id
          ) {
            unsubscribeToCompetition(
              subscriptionsSocket,
              sportData?.competition_id.toString(),
              uuid
            );
          }
          dispatch(setActiveSocketSubscribe(null));
        });

        if (subscriptionsSocket?.connected) {
          if (activeSocketSubscribe === "SUBSCRIBE_SPORT" && activeSport) {
            unsubscribeToSport(
              subscriptionsSocket,
              activeSport.toString(),
              uuid
            );
          } else if (
            activeSocketSubscribe === "SUBSCRIBE_MATCH" &&
            sportData?.match_id
          ) {
            unsubscribeToMatch(
              subscriptionsSocket,
              sportData?.match_id.toString(),
              uuid
            );
          } else if (
            activeSocketSubscribe === "SUBSCRIBE_MARKET" &&
            sportData?.market_id
          ) {
            unsubscribeToMarket(
              subscriptionsSocket,
              sportData?.market_id.toString(),
              uuid
            );
          } else if (
            activeSocketSubscribe === "SUBSCRIBE_COMPETITION" &&
            sportData?.competition_id
          ) {
            unsubscribeToCompetition(
              subscriptionsSocket,
              sportData?.competition_id.toString(),
              uuid
            );
          }
          dispatch(setActiveSocketSubscribe(null));
        }
      }
    }
  }, [pathname]);

  const resizeHandler = () => {
    dispatch(setMobile(nextWindow.document.documentElement.clientWidth <= 600));
    dispatch(
      setTablet(nextWindow.document.documentElement.clientWidth <= 1024)
    );
  };

  useEffect(() => {
    if (loggedUser) {
      const storedTime = sessionStorage.getItem("loggedUserInTime");
      const newTime = storedTime || new Date();
      setUsageTime(newTime);
      setRealityGamingReminder(
        loggedUser?.user_data?.settings?.safer_gambling?.reality_check
          ?.reality_check_after?.value
      );
      sessionStorage.setItem("loggedUserInTime", newTime);
    }

    if (usageTime && loggedUser) {
      const userRealityCheck =
        loggedUser?.user_data?.settings?.safer_gambling?.reality_check
          ?.reality_check_after;

      const userRealityCheckTimer = userRealityCheck?.value * 60;
      const interval = setInterval(() => {
        const currentTime = new Date();
        const usageTimeDate = new Date(usageTime);
        const differenceInSeconds = Math.floor(
          (Number(currentTime) - usageTimeDate) / 1000
        );

        if (
          differenceInSeconds > userRealityCheckTimer &&
          userRealityCheck?.name !== "Not Set"
        ) {
          setGamingAlert(true);
        }
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [loggedUser, usageTime]);

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <SocketContext.Provider
        value={{
          gamingSocket,
          subscriptionsSocket,
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
            realityGamingReminder={realityGamingReminder}
            setGamingAlert={setGamingAlert}
            setUsageTime={setUsageTime}
          />
        )}
        {showConfirm && (
          <ConfirmDepositLimitModal
            showConfirm={showConfirm}
            setShowConfirm={setShowConfirm}
          />
        )}
        <div className={classNames("base-layout", className)}>
          <Header headerData={header} />
          {children}
        </div>
        <PageContentModal />
      </SocketContext.Provider>
    </GoogleOAuthProvider>
  );
};
