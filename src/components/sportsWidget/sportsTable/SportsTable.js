import { useState } from "react";
import { useSelector } from "react-redux";
import { EmptyState } from "../../emptyState/EmptyState";
import { MarketOptions } from "../../matches/MarketOptions";
import MatchCard from "../../matches/MatchCard";
import { SportsBanner } from "../SportsBanner";
import "./SportsTable.css";
import { useTranslations } from "next-intl";
import { Accordion } from "@/components/Accordion/Accordions";

export const SportsTable = ({ data, type }) => {
  const t = useTranslations("common");
  const isTablet = useSelector((state) => state.isTablet);
  const [sports, setSports] = useState(data.sports);

  return (
    <div className="home-live-matches container-swifty-special mainInPlay">
      {data?.title && (
        <SportsBanner
          title={data?.title}
          subtitle={data?.subtitle}
          setData={setSports}
          data={data}
          image={data?.header_banner}
        />
      )}
      {sports.length > 0 ? (
        <div className="sports-table-sports">
          {sports?.map((sport, index) => {
            return (
              <Accordion
                title={sport.name}
                className="sport-accordion"
                key={sport.slug}
                active={index === 0}
              >
                {!isTablet && <MarketOptions options={sport?.market_types} />}
                {sport?.competitions?.map((competition, competitionIndex) => {
                  return (
                    <Accordion
                      key={competition.id}
                      className="leagues-accordion"
                      title={competition.name}
                      active={index === 0 && competitionIndex === 0}
                    >
                      {competition.events.map((event) => {
                        return (
                          <div key={event.id}>
                            <MatchCard
                              match={event}
                              inPlay={type === "sport_widget_in_play"}
                            />
                          </div>
                        );
                      })}
                    </Accordion>
                  );
                })}
              </Accordion>
            );
          })}
        </div>
      ) : (
        <EmptyState
          message={
            data.details.widget_type === "in_play"
              ? t("no_live_events_message")
              : t("there_are_no_upcoming_events")
          }
        />
      )}
    </div>
  );
};
