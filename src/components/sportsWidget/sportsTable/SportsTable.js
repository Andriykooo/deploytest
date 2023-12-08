import { useState } from "react";
import { useSelector } from "react-redux";
import { EmptyState } from "../../emptyState/EmptyState";
import { MarketOptions } from "../../matches/MarketOptions";
import MatchCard from "../../matches/MatchCard";
import { SportsBanner } from "../SportsBanner";
import "./SportsTable.css";
import { useTranslations } from "next-intl";
import { Accordion } from "@/components/Accordion/Accordions";

export const SportsTable = ({ data, type, disableCta }) => {
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
          disableCta={disableCta}
        />
      )}
      {sports.length > 0 ? (
        <div className="sports-table-sports">
          {sports?.map((sport) => {
            const hasFavouriteCompetition = sport.competitions.some(
              (competition) => competition.favorite
            );

            return (
              <Accordion
                title={sport.name}
                className="sport-accordion"
                key={sport.slug}
                active={hasFavouriteCompetition}
              >
                {!isTablet && <MarketOptions options={sport?.market_types} />}
                {sport?.competitions?.length > 0 ? (
                  sport?.competitions?.map((competition) => {
                    return (
                      <Accordion
                        key={competition.id}
                        className="leagues-accordion"
                        title={competition.name}
                        active={!!competition.favorite}
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
                  })
                ) : (
                  <div className="sports-table-empty-state">
                    <EmptyState message={t("there_are_no_upcoming_events")} />
                  </div>
                )}
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
