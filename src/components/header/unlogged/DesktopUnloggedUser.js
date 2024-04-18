import { useDispatch, useSelector } from "react-redux";
import { SlipIcon } from "@/icons/SlipIcon";
import { useTranslations } from "@/hooks/useTranslations";
import { setSidebarRight } from "@/store/actions";
import { CustomLink } from "@/components/Link/Link";

export const DesktopUnloggedUser = () => {
  const dispatch = useDispatch();
  const t = useTranslations("header");
  const sidebarRight = useSelector((state) => state.sidebarRight);
  const selectedBets = useSelector((state) => state.selectedBets);

  return (
    <div
      className={
        selectedBets?.singles?.length > 0
          ? "sing-up-txt between-container"
          : "sing-up-txt"
      }
    >
      {selectedBets?.singles?.length > 0 && (
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
          {selectedBets?.singles?.length > 0 && (
            <span className="total-slip-bets">
              {selectedBets?.singles?.length}
            </span>
          )}
        </div>
      )}
      <CustomLink className="d-flex" href="/login">
        <p className="signText">{t("register_or_login")}</p>
      </CustomLink>
    </div>
  );
};
