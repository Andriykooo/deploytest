import { useDispatch, useSelector } from "react-redux";
import { SlipIcon } from "../../../utils/icons";
import { useTranslations } from "next-intl";
import { setSidebarRight } from "@/store/actions";
import { CustomLink } from "@/components/Link/Link";
import { useClientPathname } from "@/hooks/useClientPathname";

export const MobileUnloggedUser = () => {
  const betslipResponse = useSelector((state) => state.betslipResponse);
  const dispatch = useDispatch();
  const { pathname } = useClientPathname();
  const t = useTranslations("header");
  const sidebarRight = useSelector((state) => state.sidebarRight);

  return (
    <div className="sing-up-txt mobileAccInfo unlogged">
      <div className="d-flex align-items-center">
        {betslipResponse?.singles?.length > 0 && (
          <div
            className="slip-icon-loggedOut"
            onClick={() => {
              dispatch(
                setSidebarRight({
                  isActive: !sidebarRight.isActive,
                })
              );
            }}
          >
            <SlipIcon />
            {betslipResponse && betslipResponse?.singles?.length > 0 && (
              <span className="total-slip-bets">
                {betslipResponse?.singles?.length}
              </span>
            )}
          </div>
        )}
        <CustomLink
          className="signInContainer"
          href={`/login?redirect=${pathname.replace("/", "")}`}
        >
          <p className="signText">{t("register_or_login")}</p>
        </CustomLink>
      </div>
    </div>
  );
};
