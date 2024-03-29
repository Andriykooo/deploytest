"use client";

import { Tooltip } from "@/components/Tooltip/Tooltip";
import { AlertModal } from "@/components/alertModal/AlertModal";
import CookieBanner from "@/components/CookieBanner/CookieBanner";
import { PageContentModal } from "@/components/pageContentModal/PageContentModal";
import { ConfirmDepositLimitModals } from "@/screens/DepositLimit/ConfirmDepositLimitModal";
import PrivacyConfirmModal from "@/screens/Privacy/PrivacyConfirmModal";
import GamingReminderAlert from "@/screens/RealityCheck/GamingReminder";
import PwaInstall from "@/components/pwa/PwaInstall";
import TermsConfirmModal from "@/screens/Terms/TermsConfirmModal";
import { CloseButton, SuccesToast, alertToast } from "@/utils/alert";
import { addLocalStorageItem, getLocalStorageItem } from "@/utils/localStorage";
import { nextWindow } from "@/utils/nextWindow";
import { useTranslations } from "next-intl";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { Helmet } from "react-helmet";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { apiUrl, fallbackLng } from "../../utils/constants";
import { getUserApi } from "@/utils/apiQueries";
import {
  communicationSocket,
  connectSocket,
  gamingSocket,
} from "../../context/socket";
import {
  setBetTicker,
  setCountry,
  setCurrentTime,
  setFavouriteGames,
  setIsVerifyMessage,
  setLanguage,
  setLoggedUserData,
  setMobile,
  setNewOfferTimer,
  setOnBoardingData,
  setReviewBets,
  setSettings,
  setSidebarLeft,
  setSidebarRight,
  setTablet,
  setUserStats,
  upadateUserBalance,
  updatePageLayoutContent,
  setNotifyCasinoSession,
  updateSelections,
  addUpdatedEvents,
  addProviderSuspended,
  removeProviderSuspended,
} from "../../store/actions";
import { apiServices } from "@/utils/apiServices";
import { CustomCookie } from "@/utils/cookie";
import { useInternetStatus } from "@/hooks/useInternetStatus";
import { useCustomRouter } from "@/hooks/useCustomRouter";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import "./BaseLayout.css";

export const BaseLayout = ({ children }) => {
  const dispatch = useDispatch();
  const params = useParams();
  const router = useCustomRouter();
  const t = useTranslations("common");
  const accessToken = getLocalStorageItem("access_token");
  const deviceIdMaybe = getLocalStorageItem("device_id");
  const isOnline = useInternetStatus();
  const searchParams = useSearchParams();
  const newTabId = useMemo(() => uuidv4(), []);

  const getUserData = () => {
    getUserApi(dispatch).then((result) => {
      dispatch(setLoggedUserData(result));
      dispatch(
        setIsVerifyMessage(
          result?.kyc_status === "not_started" ||
            result?.kyc_status === "rejected"
        )
      );
    });

    apiServices.get(apiUrl.GET_FAVORITES).then((response) => {
      dispatch(setFavouriteGames(response));
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
  };

  useEffect(() => {
    const btag = searchParams.get("btag");

    if (btag) {
      CustomCookie.set("btag", btag);
      addLocalStorageItem("btag", btag);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!isOnline) {
      router.push("/no_internet");
    }
  }, [isOnline, router]);

  useEffect(() => {
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

      const language = result.languages?.find(
        (lang) => lang.code2.toLowerCase() === params.lng
      );

      dispatch(
        setLanguage(
          result.languages?.find(
            (lang) => lang.code2.toLowerCase() === params.lng
          )
        )
      );

      CustomCookie.set("language", language?.code2 || fallbackLng);
      addLocalStorageItem("language", language?.code2 || fallbackLng);
    });

    apiServices
      .get(apiUrl.GET_SETTINGS)
      .then((result) => {
        const country = result?.country || result?.default_country;

        dispatch(setSettings(result));

        dispatch(setCountry(country));

        addLocalStorageItem("country", country);
      })
      .catch();

    apiServices.get(apiUrl.GET_SIDEBAR_LEFT).then((response) => {
      dispatch(setSidebarLeft({ data: response }));
    });

    apiServices.get(apiUrl.GET_SIDEBAR_RIGHT).then((response) => {
      dispatch(
        setSidebarRight({
          data: response,
        })
      );

      const selections = {};

      response.betslips?.forEach((betslip) => {
        betslip.button.selections.forEach((selection) => {
          selections[selection.bet_id] = selection;
        });
      });

      dispatch(updateSelections(Object.values(selections)));
    });

    apiServices.get(apiUrl.GET_CSS_CONTENT).then((response) => {
      addLocalStorageItem("desktop_logo", response.desktop_logo);
      addLocalStorageItem("mobile_logo", response.mobile_logo);
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

        case "sidebar_right_updated":
          apiServices.get(apiUrl.GET_SIDEBAR_RIGHT).then((response) => {
            dispatch(
              setSidebarRight({
                data: response,
              })
            );
          });
          break;

        case "component_updated":
          gamingSocket.emit(
            "page_layout_component",
            { value: response.value.id, type: response.value.type },
            (response) => {
              dispatch(
                updatePageLayoutContent({
                  content: response.data,
                  slug: params?.path?.[0] || "index",
                  language: params.lng,
                })
              );
            }
          );

          break;

        case "user_updated":
          apiServices.get(apiUrl.USER_STATS).then((response) => {
            dispatch(setUserStats(response));
          });

          getUserApi(dispatch).then((response) => {
            dispatch(setLoggedUserData(response));
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
              is_trader_chat_enabled: false,
            })
          );
          break;

        case "trader_chat_enabled":
          dispatch(
            setSettings({
              is_trader_chat_enabled: true,
            })
          );
          break;

        case "new_user_balance":
          dispatch(upadateUserBalance(response.value));
          break;

        case "selection_updated": {
          dispatch(updateSelections(response.response));

          response.response.forEach((updatedSelection) => {
            const bet = document.getElementById(updatedSelection.data.bet_id);

            if (bet) {
              const previousValue = bet.getAttribute("data-current-odds");
              const newValue = updatedSelection.data.odds_decimal;

              if (+previousValue === +newValue) {
                return;
              }

              const changeType =
                +previousValue < +newValue ? "drifting" : "shortening";

              bet.className = "animationBlock";
              bet.classList.add(`${changeType}Animation`);
              bet.setAttribute("data-current-odds", newValue);
            }
          });
          break;
        }

        case "notify_casino_session":
        case "close_casino_session":
        case "close_all_casino_session":
          dispatch(setNotifyCasinoSession(response));
          break;

        case "suspend_provider":
          dispatch(addProviderSuspended(response?.value));
          break;
        case "unsuspend_provider":
          dispatch(removeProviderSuspended(response?.value));
          break;

        default:
          break;
      }
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

    gamingSocket.on("selection_updated", (response) => {
      dispatch(updateSelections(response));

      response.forEach((updatedSelection) => {
        const bet = document.getElementById(updatedSelection.data.bet_id);

        if (bet) {
          const previousValue = bet.getAttribute("data-current-odds");
          const newValue = updatedSelection.data.odds_decimal;

          if (+previousValue === +newValue) {
            return;
          }

          const changeType =
            +previousValue < +newValue ? "drifting" : "shortening";

          bet.className = "animationBlock";
          bet.classList.add(`${changeType}Animation`);
          bet.setAttribute("data-current-odds", newValue);
        }
      });
    });

    gamingSocket.on("event_updated", (response) => {
      dispatch(addUpdatedEvents(response));
    });

    gamingSocket?.on("error", (response) => {
      alertToast({
        message: response.errorMessage,
      });
    });

    connectSocket(accessToken);
    addLocalStorageItem("tab_id", newTabId);

    dispatch(setMobile(nextWindow.document.documentElement.clientWidth <= 600));
    dispatch(
      setTablet(nextWindow.document.documentElement.clientWidth <= 1024)
    );
    dispatch(
      setSidebarRight({
        isActive: nextWindow.document.documentElement.clientWidth > 1400,
      })
    );

    if (accessToken) {
      getUserData(dispatch);
    }

    if (!deviceIdMaybe) {
      const uuidV4 = uuidv4();

      addLocalStorageItem("device_id", uuidV4);
    }

    const interval = setInterval(() => {
      dispatch(setCurrentTime(new Date()));
    }, 1 * 60 * 1000);

    nextWindow.addEventListener("resize", resizeHandler);
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

  return (
    <>
      <Helmet>
        <link
          rel="stylesheet"
          type="text/css"
          href={process.env.NEXT_PUBLIC_CSS}
        />
      </Helmet>
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
          backgroundColor: "var(--global-color-notification-background)",
          color: "var(--global-color-main-text_primary)",
          fontFamily: "inherit",
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
      <CookieBanner />
      <GamingReminderAlert />
      <ConfirmDepositLimitModals />
      <PwaInstall />
      <div className="base-layout">{children}</div>
    </>
  );
};
