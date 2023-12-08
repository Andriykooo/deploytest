import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AutocompleteSelect } from "@/components/custom/AutocompleteSelect";
import { EmptyState } from "@/components/emptyState/EmptyState";
import Matches from "../../components/matches/Matches";
import SkeletonComponent from "../../utils/SkeletonComponent";
import { TabsSelect } from "@/components/tabsSelect/TabsSelect";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { SportHeader } from "@/components/SportHeader/SportHeader";
import { gamingSocket } from "@/context/socket";
import { setSportContent } from "@/store/actions";
import "../Home/Home.css";
import "../Sports/Sports.css";

export const Sport = ({ initialMarket }) => {
  const t = useTranslations();
  const dispatch = useDispatch();
  const params = useParams();

  const isMobile = useSelector((state) => state.setMobile);
  const activeSport = useSelector((state) => state.activeSport);
  const data = useSelector((state) => state.sportContent);

  const [filterIsLoading, setFilterIsLoading] = useState(false);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedMarket, setSelectedMarket] = useState(initialMarket);

  const sportContent = data?.[params?.slug]?.[selectedMarket?.market_id];

  const name = sportContent?.name || activeSport?.name;
  const marketOptions = sportContent?.market_options;

  const fetchMarketData = (foundMarket) => {
    if (!data[params?.slug][foundMarket.market_id]) {
      setFilterIsLoading(true);
    }

    gamingSocket?.emit(
      "sport_content",
      {
        value: params.slug,
        market_id: foundMarket.market_id,
        country: params.lng,
      },
      (response) => {
        setSelectedMarket(foundMarket);

        setFilterIsLoading(false);
        dispatch(
          setSportContent({
            ...data,
            [params.slug]: {
              ...data[params.slug],
              [foundMarket.market_id]: response.data,
            },
          })
        );
      }
    );
  };

  return (
    <div className="sport-container">
      <div className="sport-header">
        <SportHeader
          headerContent={
            <label className="sport-name">{name?.toUpperCase()}</label>
          }
        >
          {sportContent?.competitions?.length > 0 && (
            <div className="autoCompleteMultipleInRow">
              <AutocompleteSelect
                placeholder={t("sports.competitions")}
                data={
                  sportContent?.competitions?.map((competition) => ({
                    label: competition.name,
                    id: competition.id,
                  })) || []
                }
                onSelect={(item) => {
                  setSelectedCompetition(item?.id);
                }}
              />

              {params.slug !== "horseracing" && (
                <AutocompleteSelect
                  placeholder={t("common.region")}
                  data={
                    sportContent?.regions?.map((region, index) => ({
                      label: region.name,
                      id: index,
                    })) || []
                  }
                  onSelect={(item) => {
                    setSelectedRegion(item?.label);
                  }}
                />
              )}
            </div>
          )}
          {marketOptions?.length > 0 && (
            <div>
              <TabsSelect
                data={marketOptions?.map((market) => ({
                  label: market.market_name,
                  id: market.market_id,
                }))}
                selectedItemId={selectedMarket?.market_id}
                onChange={(selectedItem) => {
                  const foundMarket = marketOptions?.find((market) => {
                    return market.market_id === selectedItem.id;
                  });
                  fetchMarketData(foundMarket);
                }}
                placeholder={t("in_play.select_market")}
                variant={marketOptions?.length > 7 ? "scrollable" : "fullWidth"}
              />
            </div>
          )}
        </SportHeader>
      </div>

      {filterIsLoading && <SkeletonComponent isMobile={isMobile} />}
      {!filterIsLoading && (
        <>
          {sportContent?.competitions?.length > 0 ? (
            <Matches
              competitionsData={sportContent?.competitions.filter(
                (competition) => {
                  if (selectedCompetition || selectedRegion) {
                    return (
                      selectedCompetition === competition.id ||
                      competition.region === selectedRegion
                    );
                  }

                  return true;
                }
              )}
              marketOptions={sportContent?.market_options}
              inPlay={false}
              type={params.slug}
            />
          ) : (
            <EmptyState message={t("sports.no_games_available")} />
          )}
        </>
      )}
    </div>
  );
};
