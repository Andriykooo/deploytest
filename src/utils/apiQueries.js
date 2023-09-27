import {
  destroySession,
  setAlertModal,
  setPrivacytModal,
  setTermsModal,
} from "@/store/actions";
import { apiServices } from "./apiServices";
import { apiUrl } from "./constants";
import Cookies from "js-cookie";
import { clearLocalStorage } from "./localStorage";
import moment from "moment";
import { refreshGamingSocket } from "@/context/socket";
import i18next from "i18next";

export const setSettingsApi = async (body, dispatch, callback) => {
  const request = async () =>
    apiServices
      .put(apiUrl.SETTINGS, body)
      .then((response) => {
        callback?.onSuccess(response);
        return response;
      })
      .catch((error) => {
        callback?.onError(error);
      });


  const response = await request();

  if (response?.error?.code === 1007) {
    dispatch(setTermsModal({ isOpen: true, callback: request }));
    dispatch(setPrivacytModal({ isOpen: true, callback: request }));
  }

  if (response?.error?.code === 1008) {
    dispatch(setTermsModal({ isOpen: true, callback: request }));
  }

  if (response?.error?.code === 1009) {
    dispatch(setPrivacytModal({ isOpen: true, callback: request }));
  }

  return response;
};

export const getUserApi = async (dispatch) => {
  try {
    const response = await apiServices.get(apiUrl.USER);
    Cookies.set("country", response.country);

    return response;
  } catch (error) {
    const data = error.response.data.error;

    if (data?.code === 1104) {
      dispatch(
        setAlertModal({
          title: i18next.t("account_suspended"),
          message: data.message,
        })
      );
    }

    if (data?.code === 1063) {
      dispatch(
        setAlertModal({
          code: data.code,
          message: data.message.replace(
            "{date}",
            moment(data.extra_data.suspended_until).format("DD MMMM YYYY")
          ),
        })
      );
    }

    if (data?.code === 1062) {
      dispatch(
        setAlertModal({
          title: i18next.t("account_excluded"),
          message: data.message.replace(
            data.extra_data["{date}"].toString(),
            moment(data.extra_data["{date}"]).format("DD MMMM YYYY")
          ),
        })
      );
    }

    clearLocalStorage();
    refreshGamingSocket(null);
    dispatch(destroySession());

    const cookieKeys = Object.keys(Cookies.get());

    cookieKeys.forEach((cookieKey) => {
      Cookies.remove(cookieKey);
    });

    throw error;
  }
};
