import { useSelector } from "react-redux";
import { EmptyState } from "../../emptyState/EmptyState";
import { EventTable } from "../../eventTable/EventTable";
import { MatchOdds } from "../../matches/MatchOdds";
import { SportsBanner } from "../SportsBanner";
import "./StandartWidget.css";
import { useTranslations } from "next-intl";
import { v4 as uuidv4 } from "uuid";
import { gamingSocket } from "@/context/socket";
import { useEffect } from "react";

export const StandartWidget = ({ data }) => {
  const t = useTranslations("common");
  const isTablet = useSelector((state) => state.isTablet);

  useEffect(() => {
    data.selections.forEach((selection) => {
      if (selection?.bet_id) {
        gamingSocket.emit("subscribe_selection", {
          value: selection?.bet_id,
        });
      }
    });

    return () => {
      data.selections.forEach((selection) => {
        if (selection?.bet_id) {
          gamingSocket.emit("unsubscribe_selection", {
            value: selection?.bet_id,
            action_id: uuidv4(),
          });
        }
      });
    };
  }, []);

  return data?.selections?.length > 0 || data.header_banner !== "blank" ? (
    <div className="betting-in-home-slider">
      <SportsBanner
        data={data}
        title={data?.title}
        subtitle={data?.subtitle}
        image={data?.header_banner}
      />

      {data?.selections?.length > 0 ? (
        <div className="standart-widget-wrapper">
          {data?.selections?.length > 3 || isTablet ? (
            <EventTable selections={data?.selections} />
          ) : (
            <div className="standart-widget">
              {data?.selections?.map((selection, index) => {
                return (
                  <div className="standart-widget-bet" key={index}>
                    <span className="text-of-events">{selection?.name}</span>
                    <div className="odds-of-events">
                      <MatchOdds selection={selection} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <EmptyState message={t("there_are_no_upcoming_events")} />
      )}
    </div>
  ) : null;
};
