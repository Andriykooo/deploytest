import {
  setErrorCode,
  setLogOut,
  setLoggedUser,
  setUser,
} from "@/store/actions";
import { apiServices } from "./apiServices";
import { apiUrl } from "./constants";
import Cookies from "js-cookie";
import { clearLocalStorage } from "./localStorage";
import moment from "moment";

export const setSettingsApi = async (body, dispatch) => {
  const response = await apiServices.put(apiUrl.SETTINGS, body);

  if (response?.error?.code) {
    dispatch(setErrorCode(response.error.code));
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

    if (data.code === 1104) {
      dispatch(setLogOut(null));
      dispatch(setUser(null));
      dispatch(setLoggedUser(null));
      dispatch(
        setErrorCode({
          code: data.code,
          message: data.message,
        })
      );
      clearLocalStorage();
      throw error;
    }

    if (data.code === 1063) {
      dispatch(setLogOut(null));
      dispatch(setUser(null));
      dispatch(setLoggedUser(null));
      dispatch(
        setErrorCode({
          code: data.code,
          message: data.message.replace(
            "{date}",
            moment(data.extra_data.suspended_until).format("DD MMMM YYYY")
          ),
        })
      );

      clearLocalStorage();
      throw error;
    }
  }
};
