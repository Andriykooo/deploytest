import { useDispatch, useSelector } from "react-redux";
import { apiServices } from "@/utils/apiServices";
import { apiUrl } from "@/utils/constants";
import { setLoggedUser, setSignUpPlatform, setUser } from "@/store/actions";
import { addLocalStorageItem, getLocalStorageItem } from "@/utils/localStorage";
import { connectSocket } from "@/context/socket";
import { useCustomRouter } from "./useCustomRouter";
import { v4 as uuidv4 } from "uuid";
import { CustomCookie } from "@/utils/cookie";

export const useSocialLogin = (params) => {
  const dispatch = useDispatch();
  const router = useCustomRouter();
  const promo = useSelector((state) => state.promo);
  const lastVisitedPage = useSelector((state) => state.lastVisitedPage);

  return async (data, platform) => {
    try {
      if (!data?.email) {
        return;
      }

      const btag = CustomCookie.get("btag") || getLocalStorageItem("btag");

      if (btag) {
        data.promo_code = btag;
      }

      if (promo) {
        data.promo_code = promo;
      }

      const isUserExist = await apiServices.get(apiUrl.CHECK_EMAIL, {
        email: data?.email,
      });

      if (isUserExist?.email_exist) {
        const response = await apiServices.post(apiUrl.SIGNIN_SOCIAL, {
          login_platform: platform,
          social_token: data?.social_token,
        });

        dispatch(setLoggedUser(response));
        addLocalStorageItem("access_token", response?.token);
        addLocalStorageItem("refresh_token", response?.refresh_token);
        addLocalStorageItem("kyc_access_token", response?.kyc_access_token);
        addLocalStorageItem("swifty_id", response?.swifty_id);

        const uuidV4 = uuidv4();

        addLocalStorageItem("device_id", uuidV4);

        connectSocket(response?.token, uuidV4);

        router.push(lastVisitedPage);
      } else {
        const newUser = {
          email: data?.email,
          social_token: data?.social_token,
          first_name: data?.first_name,
          last_name: data?.last_name,
        };

        dispatch(setUser(newUser));
        dispatch(setSignUpPlatform(platform));
        router.push("/sign_up");
      }
    } catch (e) {
      params?.onError?.();
    }
  };
};
