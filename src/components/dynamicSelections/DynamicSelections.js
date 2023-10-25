import { useTranslations } from "next-intl";
import { LinkType } from "../LinkType/LinkType";
import { Button } from "../button/Button";
import { MatchOdds } from "../matches/MatchOdds";
import "./DynamicSelections.css";
import { useEffect } from "react";
import { gamingSocket } from "@/context/socket";
import { v4 as uuidv4 } from "uuid";

export const DynamicSelections = ({ selections, eventId }) => {
  const t = useTranslations("common");

  useEffect(() => {
    selections.forEach((selection) => {
      if (selection?.bet_id) {
        gamingSocket.emit("subscribe_market", {
          value: selection.bet_id,
        });
      }
    });

    return () => {
      selections.forEach((selection) => {
        if (selection?.bet_id) {
          gamingSocket.emit("unsubscribe_market", {
            value: selection.bet_id,
            action_id: uuidv4(),
          });
        }
      });
    };
  }, []);

  return (
    <div className="dynamic-selections">
      {selections?.length > 3 ? (
        <>
          {selections.slice(0, 2).map((selection, index) => {
            return (
              <div
                className="btnPrimary betNowButtonOFSlider dynamic-selections-button"
                key={selection.bet_id || index}
              >
                <MatchOdds key={selection.bet_id} selection={selection}>
                  {selection?.name && (
                    <span className="dynamic-selections-name">
                      {selection?.name}
                    </span>
                  )}
                </MatchOdds>
              </div>
            );
          })}
          <LinkType type="default" path={`/match/${eventId}`} className="w-100">
            <Button
              className="btnPrimary betNowButtonOFSlider dynamic-selections-button px-1"
              text={t("more")}
            />
          </LinkType>
        </>
      ) : (
        selections?.map((selection, index) => {
          return (
            <div
              className="btnPrimary betNowButtonOFSlider dynamic-selections-button"
              key={selection.bet_id || index}
            >
              <MatchOdds key={selection.bet_id} selection={selection}>
                {selection?.name && (
                  <span className="dynamic-selections-name">
                    {selection?.name}
                  </span>
                )}
              </MatchOdds>
            </div>
          );
        })
      )}
    </div>
  );
};
