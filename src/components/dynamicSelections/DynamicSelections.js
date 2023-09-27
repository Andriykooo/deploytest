import { useClientTranslation } from "@/app/i18n/client";
import { LinkType } from "../LinkType/LinkType";
import { Button } from "../button/Button";
import { MatchOdds } from "../matches/MatchOdds";
import "./DynamicSelections.css";

export const DynamicSelections = ({ selections, eventId }) => {
  const { t } = useClientTranslation("common");
  return (
    <>
      <div className="dynamic-selections">
        {selections?.length > 4 ? (
          <>
            {selections.slice(0, 3).map((selection, index) => {
              return (
                <div
                  className="btnPrimary dynamic-selections-button"
                  key={selection.bet_id || index}
                >
                  <MatchOdds selection={selection} />
                </div>
              );
            })}
            <LinkType type="default" path={`/match/${eventId}`}>
              <Button
                className="btnPrimary dynamic-selections-button"
                text={t("more")}
              />
            </LinkType>
          </>
        ) : (
          selections?.map((selection, index) => {
            return (
              <div
                className="btnPrimary dynamic-selections-button"
                key={selection.bet_id || index}
              >
                <MatchOdds key={selection.bet_id} selection={selection} />
              </div>
            );
          })
        )}
      </div>
    </>
  );
};
