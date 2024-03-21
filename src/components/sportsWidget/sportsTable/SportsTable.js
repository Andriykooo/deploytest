import { useState } from "react";
import { useSelector } from "react-redux";
import { EmptyState } from "../../emptyState/EmptyState";
import { MarketTypes } from "../../matches/MarketTypes";
import MatchCard from "../../matches/MatchCard";
import { SportsBanner } from "../SportsBanner";
import { useTranslations } from "next-intl";
import { Accordion } from "@/components/Accordion/Accordions";
import "./SportsTable.css";

export const SportsTable = ({ data, type, disableCta }) => {
  const t = useTranslations("common");
  const isTablet = useSelector((state) => state.isTablet);
  const [filter, setFilter] = useState(null);

  return (
    <div className="home-live-matches container-swifty-special mainInPlay flex-grow-1 d-flex flex-column">
      {data?.title && (
        <SportsBanner
          title={data?.title}
          subtitle={data?.subtitle}
          setFilter={setFilter}
          data={data}
          image={data?.header_banner}
          disableCta={disableCta}
        />
      )}
      {data?.sports?.length > 0 ? (
        <div className="sports-table-sports">
          {(filter?.slug === "all"
            ? data.sports
            : data.sports.filter((sport) => {
                return filter ? filter.slug === sport.slug : true;
              })
          ).map((sport) => {
            return (
              <Accordion
                title={sport.name}
                className="sport-accordion"
                key={sport.slug}
                active
              >
                {!isTablet && <MarketTypes options={sport?.market_types} />}
                {sport?.competitions?.length > 0 ? (
                  sport?.competitions?.map((competition) => {
                    return (
                      <Accordion
                        key={competition.id}
                        className="leagues-accordion"
                        title={competition.name}
                        active={!!competition.expanded}
                      >
                        {competition.events.map((event) => {
                          event.sport_slug = sport.slug;

                          return (
                            <MatchCard
                              key={event.id}
                              match={event}
                              sportSlug={competition.sport_slug}
                              inPlay={type === "sport_widget_in_play"}
                              marketTypes={sport.market_types}
                              selectedMarket={sport.market_options?.[0]}
                            />
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
