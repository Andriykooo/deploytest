import { useDispatch, useSelector } from "react-redux";
import { useClientPathname } from "@/hooks/useClientPathname";
import { SlipIcon } from "../../../utils/icons";
import { useClientTranslation } from "@/app/i18n/client";
import { setSidebarRight } from "@/store/actions";
import Link from "next/link";

export const DesktopUnloggedUser = () => {
  const dispatch = useDispatch();
  const { pathname } = useClientPathname();
  const { t } = useClientTranslation("header");
  const sidebarRight = useSelector((state) => state.sidebarRight);
  const betslipResponse = useSelector((state) => state.betslipResponse);

  return (
    <div
      className={
        betslipResponse?.singles?.length > 0
          ? "sing-up-txt between-container"
          : "sing-up-txt"
      }
    >
      {betslipResponse?.singles?.length > 0 && (
        <div
          className="slip-icon"
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
      <Link
        className="d-flex"
        href={`/login?redirect=${pathname.replace("/", "")}`}
      >
        <p className="signText">{t("register_or_login")}</p>
      </Link>
    </div>
  );
};
