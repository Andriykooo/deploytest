import { useDispatch, useSelector } from "react-redux";
import { SlipIcon } from "../../../utils/icons";
import { useTranslations } from "next-intl";
import { setSidebarRight } from "@/store/actions";
import { CustomLink } from "@/components/Link/Link";

export const MobileUnloggedUser = () => {
  const selectedBets = useSelector((state) => state.selectedBets);
  const dispatch = useDispatch();
  const t = useTranslations("header");
  const sidebarRight = useSelector((state) => state.sidebarRight);

  return (
    <div className="sing-up-txt mobileAccInfo unlogged">
      <div className="d-flex align-items-center">
        {selectedBets?.singles?.length > 0 && (
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
            {selectedBets?.singles?.length > 0 && (
              <span className="total-slip-bets">
                {selectedBets?.singles?.length}
              </span>
            )}
          </div>
        )}
        <CustomLink className="signInContainer" href="/login">
          <p className="signText">{t("register_or_login")}</p>
        </CustomLink>
      </div>
    </div>
  );
};
