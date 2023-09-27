import { v4 as uuidv4 } from 'uuid';
import { apiServices } from '@/utils/apiServices';
import { apiUrl } from '@/utils/constants';
import { addLocalStorageItem, getLocalStorageItem } from '@/utils/localStorage';
import { refreshCommunicationSocket, refreshGamingSocket } from '@/context/socket';
import { getUserApi } from '@/utils/apiQueries';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setAlertModal, setLoggedUser } from '@/store/actions';
import { useCallback } from 'react';
import { useClientTranslation } from '@/app/i18n/client';
import Cookies from 'js-cookie';
import moment from 'moment';

export function useLoginCallbacks() {
  const { t } = useClientTranslation("common");
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useSearchParams();

  const onLoginSuccess = useCallback((response, setShowConfirm) => {
    addLocalStorageItem('access_token', response?.token);
    addLocalStorageItem('refresh_token', response?.refresh_token);
    addLocalStorageItem('device_id', uuidv4());
    addLocalStorageItem('kyc_access_token', response?.kyc_access_token);
    addLocalStorageItem('swifty_id', response?.swifty_id);
    refreshCommunicationSocket(response?.token);
    refreshGamingSocket(response?.token);

    Cookies.set('country', response.user_data.country);

    getUserApi(dispatch)
      .then((userData) => {
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
          router.push("/home");
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
  }, [dispatch, router, params]);

  const onLoginError = useCallback((error) => {
    const data = error?.response?.data?.error;

    if (data?.code === 1104) {
      dispatch(
        setAlertModal({
          title: t("account_suspended"),
          message: data.message,
        })
      );
    }

    if (data?.code === 1063) {
      dispatch(
        setAlertModal({
          title: t("account_suspended"),
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
          title: t("account_excluded"),
          message: data.message.replace(
            data.extra_data["{date}"].toString(),
            moment(data.extra_data["{date}"]).format("DD MMMM YYYY")
          ),
        })
      );
    }

  }, [dispatch]);

  return { onLoginSuccess, onLoginError };
}
