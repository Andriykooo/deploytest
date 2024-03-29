import { useTranslations } from "next-intl";
import { ProfileCard } from "../ProfileCard/ProfileCard";
import {
  BetHistoryIcon,
  BonusesAndPromotionsIcon,
  ChangePasswordIcon,
  DepositIcon,
  LogOutIcon,
  NetDepositIcon,
  NotificationsIcon,
  OddsFormatIcon,
  ProfileArrowIcon,
  ProfileMenuIcon,
  SaferGamblingIcon,
  TransactionIcon,
  WithdrawIcon,
} from "@/utils/icons";
import { useClientPathname } from "@/hooks/useClientPathname";
import { useEffect, useState } from "react";
import { apiServices } from "@/utils/apiServices";
import { apiUrl } from "@/utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { setBonusesAndPromotions } from "@/store/actions";
import { Button } from "../button/Button";
import { useLogout } from "@/hooks/useLogout";

import "../../screens/Profile/Profile.css";

export const ProfileSidebar = ({ sideBarMenu, profileMenu }) => {
  const t = useTranslations("common");
  const { pathname } = useClientPathname();
  const dispatch = useDispatch();
  const logout = useLogout();

  const bonusesAndPromotions = useSelector(
    (state) => state.bonusesAndPromotions
  );
  const [activePage, setActivePage] = useState("");

  useEffect(() => {
    setActivePage(pathname);
  }, [pathname]);

  useEffect(() => {
    apiServices
      .get(`${apiUrl.GET_BONUSES_PROMOTIONS}`, { all: false })
      .then((response) => {
        dispatch(setBonusesAndPromotions({ available: response }));
      });
  }, []);

  const profileCards = [
    {
      cardName: "profile",
      icon: <ProfileMenuIcon />,
      route: "/settings/profile",
      text: "profile",
      arrow: false,
    },
    {
      cardName: "safer_gambling",
      icon: <SaferGamblingIcon />,
      route: "/settings/safer_gambling",
      text: "safer_gambling",
      arrow: false,
    },
    {
      cardName: "bonuses_promotions",
      icon: <BonusesAndPromotionsIcon />,
      route: "/settings/bonuses_promotions",
      text: "bonuses_promotions",
      buttonText: bonusesAndPromotions?.available?.length > 0 ? "New" : "",
      arrow: true,
    },
    {
      cardName: "deposit",
      icon: <DepositIcon />,
      route: "/settings/deposit",
      text: "deposit",
      arrow: true,
    },
    {
      cardName: "withdraw",
      icon: <WithdrawIcon />,
      route: "/settings/withdraw",
      text: "withdraw",
      arrow: true,
    },
    {
      cardName: "bet_history",
      icon: <BetHistoryIcon />,
      route: "/settings/bet_history",
      text: "bet_history",
      arrow: true,
    },
    {
      cardName: "transaction_history",
      icon: <TransactionIcon />,
      route: "/settings/transaction_history",
      text: "transaction_history",
      arrow: true,
    },
    {
      cardName: "net_deposit",
      icon: <NetDepositIcon />,
      route: "/settings/net_deposit",
      text: "net_deposit",
      arrow: true,
    },
    {
      cardName: "change_password",
      icon: <ChangePasswordIcon />,
      route: "/settings/change_password",
      text: "change_password",
      arrow: false,
    },
    {
      cardName: "notifications",
      icon: <NotificationsIcon />,
      route: "/settings/notifications",
      text: "notifications",
      arrow: false,
    },
    {
      cardName: "odds_format",
      icon: <OddsFormatIcon />,
      route: "/settings/odds_format",
      text: "odds_format",
      arrow: false,
    },
  ];

  const onLogOut = () => {
    logout();
  };

  return (
    <div className="sidebarProfilMenu">
      {profileCards.map((page) => {
        const isActive = activePage === page.route;

        return (
          <div key={page.text} className="borderProfile">
            {sideBarMenu && (
              <ProfileCard
                href={page.route}
                active={isActive}
                onClick={() => {
                  setActivePage(page.route);
                }}
              >
                <div
                  className={
                    isActive ? "sidebarBox" : "sidebarBox profileMenuDisplay"
                  }
                >
                  <div className="profileMenuTimeTitle">
                    {page.icon}
                    <span>{t(page.cardName)}</span>
                  </div>
                  {page?.buttonText && (
                    <button className="link-in-bonuses-promotions">
                      {page?.buttonText}
                    </button>
                  )}
                  {profileMenu && <ProfileArrowIcon className="profileMenu" />}
                </div>
              </ProfileCard>
            )}
          </div>
        );
      })}

      <Button
        className="logoutBtn"
        type="button"
        onClick={onLogOut}
        text={
          <span>
            Log out
            <LogOutIcon />
          </span>
        }
      />
    </div>
  );
};
