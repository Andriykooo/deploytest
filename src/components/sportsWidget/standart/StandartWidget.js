import { useSelector } from "react-redux";
import { EmptyState } from "../../emptyState/EmptyState";
import { EventTable } from "../../eventTable/EventTable";
import { MatchOdds } from "../../matches/MatchOdds";
import { SportsBanner } from "../SportsBanner";
import "./StandartWidget.css";
import { useClientTranslation } from "@/app/i18n/client";

export const StandartWidget = ({ data }) => {
  const { t } = useClientTranslation("common");
  const isTablet = useSelector((state) => state.isTablet);

  return data?.selections?.length > 0 || data.header_banner !== "blank" ? (
    <div className="betting-in-home-slider">
      {data.header_banner && (
        <SportsBanner
          title={data?.title}
          subtitle={data?.subtitle}
          image={data?.header_banner}
        />
      )}

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
        <EmptyState message={t("no_more_events_today_message")} />
      )}
    </div>
  ) : null;
};
