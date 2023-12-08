import Image from "next/image";
import { predictionPages } from "../../utils/constants";
import { images } from "../../utils/imagesConstant";
import { Button } from "../button/Button";
import { useTranslations } from "next-intl";
import { CustomLink } from "../Link/Link";
import { ProfileCard } from "../ProfileCard/ProfileCard";
import { useCustomRouter } from "@/hooks/useCustomRouter";

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
          onClick={() => router.push("/profile/profile")}
        />
      </div>
      <p className="historyBets">{t("common.bet_history")}</p>
      <div className="predictions-menu">
        {predictionPages.map((value, index) => {
          return (
            <div className="borderProfile" key={index}>
              <CustomLink href={value.route}>
                <ProfileCard
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
                    <Image
                      src={images.arrowIcon}
                      alt="arrow"
                      className="arrow rotate profileMenu"
                    />
                  </div>
                </ProfileCard>
              </CustomLink>
            </div>
          );
        })}
      </div>
    </>
  );
};
