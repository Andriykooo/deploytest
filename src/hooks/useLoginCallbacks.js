import { v4 as uuidv4 } from "uuid";
import { apiServices } from "@/utils/apiServices";
import { apiUrl } from "@/utils/constants";
import { addLocalStorageItem, getLocalStorageItem } from "@/utils/localStorage";
import {
  refreshCommunicationSocket,
  refreshGamingSocket,
} from "@/context/socket";
import { getUserApi } from "@/utils/apiQueries";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setAlertModal, setLoggedUser } from "@/store/actions";
import { useCallback } from "react";
import { useTranslations } from "next-intl";
import Cookies from "js-cookie";
import moment from "moment";

const ContactsInfo = () => {
  const t = useTranslations("contact_us");
  const settings = useSelector((state) => state.settings);

  return (
    <div className="d-flex align-items-center justify-content-center flex-column">
      {t("customer_service")}
      <br />
      <a
        href={`mailto:${settings?.companyServiceEmail}`}
        className="customer-service-notice-email"
      >
        {settings?.companyServiceEmail}
      </a>
    </div>
  );
};

export function useLoginCallbacks() {
  const t = useTranslations("common");
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useSearchParams();

  const onLoginSuccess = useCallback(
    (response, setShowConfirm) => {
      addLocalStorageItem("access_token", response?.token);
      addLocalStorageItem("refresh_token", response?.refresh_token);
      addLocalStorageItem("device_id", uuidv4());
      addLocalStorageItem("kyc_access_token", response?.kyc_access_token);
      addLocalStorageItem("swifty_id", response?.swifty_id);
      refreshCommunicationSocket(response?.token);
      refreshGamingSocket(response?.token);

      Cookies.set("country", response.user_data.country);

      getUserApi(dispatch).then((userData) => {
        let nextUrlPath = getLocalStorageItem("nextUrlPath");
        dispatch(setLoggedUser({ ...response, user_data: userData }));

        if (!userData.email_verified) {
          apiServices.get(apiUrl.RESEND_EMAIL).then(() => {
            router.push("/verify_email");
          });
        } else if (params.get("redirect")) {
          router.push("/" + params.get("redirect"));
        } else if (nextUrlPath && nextUrlPath === "casino") {
          router.push("/casino");
        } else {
          router.push("/");
        }

        if (setShowConfirm) {
          if (
            response?.user_data?.actions &&
            response?.user_data?.actions.length > 0
          ) {
            setShowConfirm(true);
          }
        }
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
