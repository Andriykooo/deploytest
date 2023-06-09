import { LinkType } from "../LinkType/LinkType";
import { Button } from "../button/Button";
import { MatchOdds } from "../matches/MatchOdds";
import "./DynamicSelections.css";

export const DynamicSelections = ({ selections, eventId }) => {
  return (
    <>
      <div className="dynamic-selections">
        {selections.length > 4 ? (
          <>
            {selections.slice(0, 3).map((selection) => {
              return (
                <div
                  className="btnPrimary dynamic-selections-button"
                  key={selection.bet_id}
                >
                  <MatchOdds selection={selection} />
                </div>
              );
            })}
            <LinkType type="default" path={`/match/${eventId}`}>
              <Button
                className="btnPrimary dynamic-selections-button"
                text="MORE"
              />
            </LinkType>
          </>
        ) : (
          selections.map((selection) => {
            return (
              <div
                className="btnPrimary dynamic-selections-button"
                key={selection.bet_id}
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
