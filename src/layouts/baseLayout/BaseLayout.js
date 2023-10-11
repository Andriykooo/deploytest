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
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
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
  setOnBoardingData,
  setResultedEvents,
  setSettings,
  setSportData,
  setSportTypes,
  setTablet,
  setUpdatedSelections,
  updatePageLayoutContent,
} from "../../store/actions";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import { CustomerServiceNotice } from "@/screens/CustomerServiceNotice/CustomerServiceNotive";
import { getUserApi } from "@/utils/apiQueries";
import { AlertModal } from "@/components/alertModal/AlertModal";
import { useClientTranslation } from "@/app/i18n/client";
import { useClientPathname } from "@/hooks/useClientPathname";
import { Tooltip } from "@/components/Tooltip/Tooltip";

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
];

const Content = ({ children, className }) => {
  const { t } = useClientTranslation("common");
  const [gamingAlert, setGamingAlert] = useState(false);

  const header = useSelector((state) => state.headerData);
  const loggedUser = useSelector((state) => state.loggedUser);
  const activeSport = useSelector((state) => state.activeSport);
  const settings = useSelector((state) => state.settings);
  const isVerifyMessage = useSelector((state) => state.isVerifyMessage);
  const accessToken = getLocalStorageItem("access_token");

  const dispatch = useDispatch();
  const { pathname } = useClientPathname();
  const router = useRouter();
  const params = useParams();

  const currentPage = header?.find((page) => page.path === pathname);

  const isModal = useMemo(() => {
    return modalList.some((modalPath) => {
      if (modalPath.endsWith("/*")) {
        const prefix = modalPath.slice(0, -2);
        return pathname.startsWith(prefix);
      }
      return pathname === modalPath;
    });
  }, [pathname]);

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

    gamingSocket.on("selection_updated", (response) => {
      dispatch(setUpdatedSelections(response));
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

        apiServices.post(apiUrl.GET_BET_SLIP, {
          bets: [],
          stakes: [],
          action: "place",
          bet_referral_id: response?.bet_referral_id,
        });
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
      gamingSocket.off("selection_updated");
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
  }, [loggedUser?.token]);

  const disableHeader =
    (params?.path &&
      !header?.some((page) => page.path.substring(1) == params?.path)) ||
    pathname === "/not_found" ||
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
        <AlertModal />
        <PrivacyConfirmModal />
        <TermsConfirmModal />
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
        <PageContentModal />
      </SocketContext.Provider>
    </GoogleOAuthProvider>
  );
};

export const BaseLayout = (props) => {
  const { pathname } = useClientPathname();

  return pathname === "/customer_service_notice" ? (
    <CustomerServiceNotice />
  ) : (
    <Content />
  );
};
