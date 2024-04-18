import { useTranslations } from "@/hooks/useTranslations";
export const MarketTypes = ({ options }) => {
  const t = useTranslations("sports");
  return (
    <div className="matchCardRowContainer">
      <div className="matchCard selections">
        <div className="matchCardDate type">{t("time")}</div>
        <div className="matchesContainer">
          <div className="eventStyle">{t("event")}</div>
        </div>
        <div className="odds rowOdds">
          {options?.map((selection, index) => {
            return (
              <div
                key={index}
                className={"selectionName firstSelection inPlayPlaceBet"}
              >
                {selection?.outcome_name || selection.name}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
