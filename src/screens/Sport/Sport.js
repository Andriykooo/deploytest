import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AutocompleteSelect } from "@/components/custom/AutocompleteSelect";
import { EmptyState } from "@/components/emptyState/EmptyState";
import Matches from "../../components/matches/Matches";
import SkeletonComponent from "../../components/SkeletonComponent/SkeletonComponent";
import { TabsSelect } from "@/components/tabsSelect/TabsSelect";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { SportHeader } from "@/components/SportHeader/SportHeader";
import {
  setSportContent,
  setSportFilters,
  updateSelections,
} from "@/store/actions";
import "../Home/Home.css";
import "../Sports/Sports.css";
import { apiServices } from "@/utils/apiServices";
import { apiUrl } from "@/utils/constants";
import { gamingSocket } from "@/context/socket";
import { v4 as uuidv4 } from "uuid";

export const Sport = ({ initialData }) => {
  const t = useTranslations();
  const dispatch = useDispatch();
  const params = useParams();

  const activeSport = useSelector((state) => state.activeSport);
  const data = useSelector((state) => state.sportContent);
  const sportFilters = useSelector((state) => state.sportFilters);

  const [filterIsLoading, setFilterIsLoading] = useState(false);

  const { selectedCompetition, selectedRegion, selectedMarket, sportSlug } =
    sportFilters;

  const sportContent = data?.[params?.slug]?.[selectedMarket?.market_id];

  const competitionNames = sportContent?.competitions
    ? sportContent.competitions
        .filter((competition) => {
          if (selectedRegion) {
            return selectedRegion.label === competition.region;
          }

          return true;
        })
        .map(({ name, id }) => ({ label: name, id }))
        .sort((a, b) => a?.label?.localeCompare(b?.label))
    : [];

  const name = initialData?.name || activeSport?.name;

  const fetchMarketData = (foundMarket) => {
    if (!data[params?.slug][foundMarket.market_id]) {
      setFilterIsLoading(true);
    }

    changeSportFilters({
      selectedMarket: foundMarket,
    });

    apiServices
      .get(apiUrl.GET_SPORT_CONTENT, {
        value: params.slug,
        market_id: foundMarket.market_id,
        country: params.lng,
      })
      .then((response) => {
        dispatch(
          setSportContent({
            ...data,
            [params.slug]: {
              ...data[params.slug],
              [foundMarket.market_id]: response,
            },
          })
        );

        const selections = {};

        response.competitions?.forEach((competition) => {
          competition.events.forEach((event) => {
            event.selections.forEach((selection) => {
              if (selection) {
                selections[selection.bet_id] = selection;
              }
            });
          });
        });

        dispatch(updateSelections(Object.values(selections)));
      })
      .finally(() => {
        setFilterIsLoading(false);
      });
  };

  useEffect(() => {
    gamingSocket.on("connection", () => {
      gamingSocket.emit("subscribe_market", {
        value: selectedMarket?.market_id,
      });
    });

    gamingSocket.emit("subscribe_market", {
      value: selectedMarket?.market_id,
    });

    return () => {
      gamingSocket.emit("unsubscribe_market", {
        value: selectedMarket?.market_id,
        action_id: uuidv4(),
      });
    };
  }, [selectedMarket]);

  const changeSportFilters = (newValues) => {
    dispatch(setSportFilters({ ...newValues }));
  };

  useEffect(() => {
    if (params.slug !== sportSlug)
      changeSportFilters({
        selectedCompetition: null,
        selectedRegion: null,
        selectedMarket: initialData?.market_options?.[0],
        sportSlug: params?.slug,
      });
  }, [params?.slug]);

  return (
    <div className="sport-container">
      <div className="sport-header">
        <SportHeader
          headerContent={
            <label className="sport-name">{name?.toUpperCase()}</label>
          }
        >
          <div className="autoCompleteMultipleInRow">
            <AutocompleteSelect
              placeholder={t("common.region")}
              data={
                initialData?.regions?.map((region, index) => ({
                  label: region.name,
                  id: index,
                })) || []
              }
              onSelect={(item) => {
                changeSportFilters({
                  selectedRegion: item,
                  selectedCompetition: null,
                });
              }}
              selectedItem={selectedRegion}
              ignorePageChange={true}
            />
            <AutocompleteSelect
              placeholder={t("sports.competitions")}
              data={competitionNames}
              onSelect={(item) => {
                changeSportFilters({
                  selectedCompetition: item,
                });
              }}
              selectedItem={selectedCompetition}
              ignorePageChange={true}
            />
          </div>
          <div>
            <TabsSelect
              data={initialData?.market_options?.map((market) => ({
                label: market.market_name,
                id: market.market_id,
              }))}
              selectedItemId={selectedMarket?.market_id}
              selectedItemLabel={selectedMarket?.market_name}
              onChange={(selectedItem) => {
                const foundMarket = initialData.market_options?.find(
                  (market) => {
                    return (
                      market.market_id === selectedItem.id &&
                      market.market_name === selectedItem.label
                    );
                  }
                );
                fetchMarketData(foundMarket);
              }}
              placeholder={t("in_play.select_market")}
              variant={
                initialData?.market_options?.length > 7
                  ? "scrollable"
                  : "fullWidth"
              }
            />
          </div>
        </SportHeader>
      </div>

      {!filterIsLoading ? (
        <>
          {sportContent?.competitions?.length > 0 ? (
            <Matches
              competitionsData={sportContent?.competitions.filter(
                (competition) => {
                  if (selectedCompetition) {
                    return selectedCompetition.id === competition.id;
                  }

                  if (selectedRegion) {
                    return selectedRegion.label === competition.region;
                  }

                  return true;
                }
              )}
              marketOptions={sportContent?.market_options}
              inPlay={false}
              type={params.slug}
              marketTypes={sportContent?.market_types}
              selectedMarket={selectedMarket}
            />
          ) : (
            <EmptyState message={t("sports.no_games_available")} />
          )}
        </>
      ) : (
        <SkeletonComponent disableHeader className="mx-3" />
      )}
    </div>
  );
};
