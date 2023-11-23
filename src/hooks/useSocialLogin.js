import { useCustomRouter } from "./useCustomRouter";

const { refreshCommunicationSocket } = require("@/context/socket");
const {
  setLoggedUser,
  setUser,
  setSignUpPlatform,
} = require("@/store/actions");
const { apiServices } = require("@/utils/apiServices");
const { apiUrl } = require("@/utils/constants");
const { addLocalStorageItem } = require("@/utils/localStorage");
const { useRouter } = require("next/navigation");
const { useSelector, useDispatch } = require("react-redux");

export const useSocialLogin = (params) => {
  const router = useCustomRouter();
  const dispatch = useDispatch();
  const promo = useSelector((state) => state.promo);

  return async (data, platform) => {
    try {
      if (!data?.email) {
        return;
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
        refreshCommunicationSocket(response?.token);
        router.push("/");
      } else {
        const newUser = {
          email: data.email,
          social_token: response?.accessToken,
          first_name: data.first_name,
          last_name: data.last_name,
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
