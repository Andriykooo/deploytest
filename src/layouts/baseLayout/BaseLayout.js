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
import { v4 as uuidv4 } from "uuid";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
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
  setIsVerifyMessage,
  setLoggedUser,
  setMobile,
  setNewOfferTimer,
  setOnBoardingData,
  setResultedEvents,
  setReviewBets,
  setSettings,
  setSidebarRight,
  setSportTypes,
  setTablet,
  setUpdatedSelections,
  setUserStats,
} from "../../store/actions";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import { CustomerServiceNotice } from "@/screens/CustomerServiceNotice/CustomerServiceNotive";
import { getUserApi } from "@/utils/apiQueries";
import { AlertModal } from "@/components/alertModal/AlertModal";
import { useTranslations } from "next-intl";
import { Tooltip } from "@/components/Tooltip/Tooltip";
import moment from "moment";

const modalList = [
  "/privacy",
  "/verification",
  "/kyc",
  "/login",
  "/terms",
  "/affiliates",
  "/sign_up",
  "/sign_up_with_phone",
  "/forgot_password",
  "/verify_email",
  "/verify_phone",
  "/email_sent",
  "/finish_account_setup",
  "/profile/*",
  "/promo/*",
];

const Content = ({ children, className }) => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const t = useTranslations("common");
  const accessToken = getLocalStorageItem("access_token");
  const deviceIdMaybe = getLocalStorageItem("device_id");

  if (!deviceIdMaybe) {
    const uuidV4 = uuidv4();

    addLocalStorageItem("device_id", uuidV4);
  }

  const header = useSelector((state) => state.headerData);
  const loggedUser = useSelector((state) => state.loggedUser);
  const activeSport = useSelector((state) => state.activeSport);
  const settings = useSelector((state) => state.settings);
  const isVerifyMessage = useSelector((state) => state.isVerifyMessage);

  const [gamingAlert, setGamingAlert] = useState(false);

  const newTabId = useMemo(() => uuidv4(), []);
  const isModal = useMemo(() => {
    return modalList.some((modalPath) => {
      let path = pathname;

      if (pathname.startsWith(`/${params.lng}`)) {
        path = pathname.replace(`/${params.lng}`, "");
      }

      if (modalPath.endsWith("/*")) {
        const prefix = modalPath.slice(0, -2);
        return path.startsWith(prefix);
      }

      return path === modalPath;
    });
  }, [pathname]);

  const disableHeader =
    (params?.path &&
      !header?.some((page) => page.path.substring(1) == params?.path)) ||
    pathname === "/not_found" ||
    pathname === `/${params.lng}/error` ||
    pathname === "/customer_service_notice";

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
    getUserApi(dispatch).then((result) => {
      dispatch(setLoggedUser({ ...newUser, user_data: result }));
    });
  };

  const storageListener = (event) => {
    if (event.key === "new_offer") {
      dispatch(
        setReviewBets({
          singles: [],
          combinations: [],
          total_stakes: 0,
          total_payout: 0,
        })
      );
    }

    if (event.key === "tab_id" && event.newValue === "removed") {
      addLocalStorageItem("tab_id", newTabId);
    }
  };

  const resizeHandler = () => {
    dispatch(setMobile(nextWindow.document.documentElement.clientWidth <= 600));
    dispatch(
      setTablet(nextWindow.document.documentElement.clientWidth <= 1024)
    );

    dispatch(
      setSidebarRight({
        isActive: nextWindow.document.documentElement.clientWidth > 1400,
      })
    );
  };

  useEffect(() => {
    if (loggedUser && accessToken) {
      getUserData();
    }

    apiServices
      .get(apiUrl.GET_SETTINGS)
      .then((result) => {
        dispatch(setSettings(result));
      })
      .catch();

    apiServices.get(apiUrl.ON_BOARDING).then((result) => {
      dispatch(
        setOnBoardingData({
          ...result,
          languages: result?.languages?.map((language) => ({
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
      setSidebarRight({
        isActive: nextWindow.document.documentElement.clientWidth > 1400,
      })
    );

    moment.locale(params.lng);
    addLocalStorageItem("tab_id", newTabId);
    addLocalStorageItem("language", params.lng);

    nextWindow.addEventListener("resize", resizeHandler);

    gamingSocket?.on("error", (response) => {
      alertToast({
        message: response.errorMessage,
      });

      if (response.errorMessage == t("page_content_not_found")) {
        router.push(pathname);
      }
    });

    communicationSocket?.on("new_event", (response) => {
      switch (response?.type) {
        case "bet_ticker_update":
          dispatch(
            setBetTicker({
              ...response,
              status: response?.new_status,
            })
          );

          if (response?.new_status === "rejected") {
            alertToast({
              message: t("trader_offer_expired"),
              autoClose: false,
            });
          }
          break;

        case "user_updated":
          apiServices.get(apiUrl.USER_STATS).then((response) => {
            dispatch(setUserStats(response));
          });
          break;

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
              is_trader_chat_enabled: false,
            })
          );
          break;

        case "trader_chat_enabled":
          dispatch(
            setSettings({
              ...settings,
              is_trader_chat_enabled: true,
            })
          );
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

    gamingSocket.on("selection_updated", (response) => {
      dispatch(setUpdatedSelections(response));
    });

    communicationSocket?.on("bet_referral_message", (response) => {
      if (response?.status === "approved") {
        dispatch(
          setBetTicker({
            status: response?.status,
            bet_referral_id: response?.bet_referral_id,
          })
        );

        dispatch(
          setReviewBets({
            singles: [],
            combinations: [],
            total_stakes: 0,
            total_payout: 0,
          })
        );

        SuccesToast({
          message: t("trader_accepted_the_bet"),
          autoClose: false,
          onClose: () => {
            dispatch(
              setBetTicker({
                status: "",
                bet_referral_id: "",
              })
            );
          },
        });

        if (newTabId === getLocalStorageItem("tab_id")) {
          apiServices.post(apiUrl.GET_BET_SLIP, {
            bets: [],
            stakes: [],
            action: "place",
            bet_referral_id: response?.bet_referral_id,
          });
        }
      }

      if (response?.status === "rejected") {
        dispatch(
          setBetTicker({
            status: response?.status,
            bet_referral_id: response?.bet_referral_id,
          })
        );

        dispatch(
          setReviewBets({
            singles: [],
            combinations: [],
            total_stakes: 0,
            total_payout: 0,
          })
        );

        alertToast({
          message: t("trader_rejected_the_bet"),
          autoClose: false,
          onClose: () => {
            dispatch(
              setBetTicker({
                status: "",
                bet_referral_id: "",
              })
            );
          },
        });
      }

      if (response?.status === "new_offer") {
        dispatch(
          setBetTicker({
            status: response?.status,
            bet_referral_id: response?.bet_referral_id,
            bet_slip: response?.bet_slip,
          })
        );

        dispatch(setNewOfferTimer(response.bet_slip.expire_seconds));
        dispatch(setReviewBets(response.bet_slip));
      }
    });

    const interval = setInterval(() => {
      dispatch(setCurrentTime(new Date()));
    }, 1 * 60 * 1000);

    nextWindow.addEventListener("storage", storageListener);
    nextWindow.onbeforeunload = () => {
      addLocalStorageItem("tab_id", "removed");
    };

    window.fbAsyncInit = () => {
      window.FB.init({
        appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: "v18.0",
      });
    };

    return () => {
      gamingSocket.off("selection_updated");
      clearInterval(interval);
      nextWindow.removeEventListener("storage", storageListener);
      nextWindow.removeEventListener("resize", resizeHandler);
    };
  }, []);

  useEffect(() => {
    let interval = null;
    const userRealityCheck =
      loggedUser?.user_data?.settings?.safer_gambling?.reality_check
        ?.reality_check_after?.value || 15;

    if (loggedUser) {
      dispatch(
        setIsVerifyMessage(
          loggedUser?.user_data?.kyc_status === "not_started" ||
            loggedUser?.user_data?.kyc_status === "rejected"
        )
      );
    }

    if (loggedUser?.token && userRealityCheck > 0) {
      interval = setInterval(() => {
        setGamingAlert(true);
      }, userRealityCheck * 60 * 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [loggedUser]);

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
          limit={3}
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
        <AlertModal />
        <PrivacyConfirmModal />
        <TermsConfirmModal />
        <PageContentModal />
        <Tooltip />
        {gamingAlert && <GamingReminderAlert setGamingAlert={setGamingAlert} />}
        {accessToken &&
          loggedUser?.user_data?.actions?.map((action) => {
            return <ConfirmDepositLimitModal data={action} key={action.id} />;
          })}
        <div
          className={classNames("base-layout", className, {
            ["not-found"]: disableHeader,
            "kyc-status":
              loggedUser && isVerifyMessage && !disableHeader && !isModal,
          })}
        >
          <Header isModal={isModal} />
          {children}
        </div>
      </SocketContext.Provider>
    </GoogleOAuthProvider>
  );
};

export const BaseLayout = (props) => {
  const pathname = usePathname();

  return (
    <>
      <Helmet>
        <link
          rel="stylesheet"
          type="text/css"
          href={process.env.NEXT_PUBLIC_CSS}
        />
      </Helmet>

      {pathname === "/customer_service_notice" ? (
        <CustomerServiceNotice />
      ) : (
        <Content {...props} />
      )}
    </>
  );
};
