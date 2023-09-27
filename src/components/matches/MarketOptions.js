import { useClientTranslation } from "@/app/i18n/client";

export const MarketOptions = ({ options }) => {
  const { t } = useClientTranslation("sports")
  return (
    <div className="matchCardRowContainer">
      <div className="matchCard selections">
        <div className="matchCardDate">{t("time")}</div>
        <div className="matchesContainer">
          <div className="eventStyle">{t("event")}</div>
        </div>
        <div className="odds">
          {options?.map((selection, index) => {
            return (
              <div
                key={selection?.outcome_id || index}
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
