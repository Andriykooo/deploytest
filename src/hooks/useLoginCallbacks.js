import { apiServices } from "@/utils/apiServices";
import { apiUrl } from "@/utils/constants";
import { addLocalStorageItem, getLocalStorageItem } from "@/utils/localStorage";
import { connectSocket } from "@/context/socket";
import { getUserApi } from "@/utils/apiQueries";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  setAlertModal,
  setFavouriteGames,
  setLoggedUser,
  setRedirectAfterLogin,
  setSidebarLeft,
} from "@/store/actions";
import { useCallback } from "react";
import { useTranslations } from "@/hooks/useTranslations";
import moment from "moment";
import { useCustomRouter } from "./useCustomRouter";
import { messagingGetToken } from "../../firebase";
import { v4 as uuidv4 } from "uuid";

const ContactsInfo = () => {
  const t = useTranslations("contact_us");
  const settings = useSelector((state) => state.settings);

  return (
    <div className="d-flex align-items-center justify-content-center flex-column">
      {t("customer_service")}
      <br />
      <a
        href={`mailto:${settings?.company_service_email}`}
        className="customer-service-notice-email"
      >
        {settings?.company_service_email}
      </a>
    </div>
  );
};

export function useLoginCallbacks({ loginCallback, disableRedirect }) {
  const t = useTranslations("common");
  const dispatch = useDispatch();
  const router = useCustomRouter();
  const params = useSearchParams();
  const lastVisitedPage = useSelector((state) => state.lastVisitedPage);
  const redirectAfterLogin = useSelector((state) => state.redirectAfterLogin);

  const onLoginSuccess = useCallback(
    (response, setShowConfirm) => {
      addLocalStorageItem("access_token", response?.token);
      addLocalStorageItem("refresh_token", response?.refresh_token);
      addLocalStorageItem("kyc_access_token", response?.kyc_access_token);
      addLocalStorageItem("swifty_id", response?.swifty_id);

      if (!disableRedirect) {
        router.push(redirectAfterLogin || lastVisitedPage);
        dispatch(setRedirectAfterLogin(""));
      }

      const uuidV4 = uuidv4();

      if (!getLocalStorageItem("device_id")) {
        addLocalStorageItem("device_id", uuidV4);
      }

      connectSocket(response?.token, uuidV4);

      dispatch(setLoggedUser(response));

      if (!response.user_data.email_verified) {
        // apiServices.get(apiUrl.RESEND_EMAIL).then(() => {
        router.push("/verify_email");
        // });
      }

      if (
        setShowConfirm &&
        response?.user_data?.actions &&
        response?.user_data?.actions.length > 0
      ) {
        setShowConfirm(true);
      }

      loginCallback?.();

      getUserApi(dispatch).then((userData) => {
        dispatch(setLoggedUser({ ...response, user_data: userData }));
      });

      apiServices.get(apiUrl.GET_FAVORITES).then((response) => {
        dispatch(setFavouriteGames(response));
      });

      messagingGetToken();

      apiServices.get(apiUrl.GET_SIDEBAR_LEFT).then((response) => {
        dispatch(setSidebarLeft({ data: response }));
      });
    },
    [dispatch, router, params]
  );

  const onLoginError = useCallback(
    (error) => {
      const data = error?.response?.data?.error;

      if (data?.code === 1104) {
        dispatch(
          setAlertModal({
            code: data?.code,
            message: <ContactsInfo />,
          })
        );
      }

      if (data?.code === 1063) {
        dispatch(
          setAlertModal({
            code: data?.code,
            message: <ContactsInfo />,
          })
        );
      }

      if (data?.code === 2280) {
        dispatch(
          setAlertModal({
            code: data?.code,
            message: <ContactsInfo />,
          })
        );
      }

      if (data?.code === 1062) {
        dispatch(
          setAlertModal({
            code: data?.code,
            message: t("account_excluded_message", {
              date: moment(data.extra_data["{date}"]).format("DD MMMM YYYY"),
            }),
          })
        );
      }
    },
    [dispatch]
  );

  return { onLoginSuccess, onLoginError };
}
