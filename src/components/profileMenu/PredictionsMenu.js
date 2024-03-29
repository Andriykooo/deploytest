import Image from "next/image";
import { images } from "../../utils/imagesConstant";
import { Button } from "../button/Button";
import { useTranslations } from "next-intl";
import { ProfileCard } from "../ProfileCard/ProfileCard";
import { useCustomRouter } from "@/hooks/useCustomRouter";
import { ArrowIcon } from "@/utils/icons";

const predictionPages = [
  {
    cardName: "open",
    image: images.openBets,
    route: "/settings/bet_history",
    text: "bet_history",
  },
  {
    cardName: "settled",
    image: images.settledBets,
    route: "/settings/settled_predictions",
    text: "settled_predictions",
  },
];

export const PredictionsMenu = ({ page, active }) => {
  const t = useTranslations();
  const router = useCustomRouter();

  return (
    <>
      <div className="d-flex pb-3">
        <Image
          src={images.goBackArrow}
          alt="Go back"
          className="ms-0"
          onClick={() => router.push("/settings/profile")}
        />
      </div>
      <p className="historyBets">{t("common.bet_history")}</p>
      <div className="predictions-menu">
        {predictionPages.map((value, index) => {
          return (
            <div className="borderProfile" key={index}>
              <ProfileCard
                href={value.route}
                key={index}
                data-id={index}
                active={value.text === page ? active : ""}
              >
                <div
                  className={`dropdown d-flex sidebarBox ${
                    value.text === page ? "active" : ""
                  }`}
                >
                  <Image
                    alt="sports-icon"
                    src={value.image}
                    className="m-2 sports-icon"
                  />
                  <Button
                    className={
                      "btn dropdown-toggle popularDropdown profile top w-100"
                    }
                    type="button"
                    text={t(`common.${value.cardName}`)}
                  />
                  <ArrowIcon className="arrow rotate profileMenu" />
                </div>
              </ProfileCard>
            </div>
          );
        })}
      </div>
    </>
  );
};
