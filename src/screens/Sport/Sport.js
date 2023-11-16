import React, { useContext, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { AutocompleteSelect } from "@/components/custom/AutocompleteSelect";
import { EmptyState } from "@/components/emptyState/EmptyState";
import Matches from "../../components/matches/Matches";
import { TabsSelect } from "@/components/tabsSelect/TabsSelect";
import { SocketContext } from "@/context/socket";
import SkeletonComponent from "../../utils/SkeletonComponent";
import "../Home/Home.css";
import "../Sports/Sports.css";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

export const Sport = ({ sportContent, setSportContent, slug }) => {
  const t = useTranslations();
  const { gamingSocket } = useContext(SocketContext);
  const isMobile = useSelector((state) => state.setMobile);
  const params = useParams();

  const [filterIsLoading, setFilterIsLoading] = useState(false);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedMarket, setSelectedMarket] = useState(
    sportContent?.market_options?.[0]
  );

  const name = useMemo(() => sportContent?.name, []);
  const marketOptions = useMemo(() => sportContent?.market_options, []);

  const fetchMarketData = (foundMarket) => {
    setFilterIsLoading(true);
    setSelectedMarket(foundMarket);

    gamingSocket?.emit(
      "sport_content",
      {
        value: slug,
        market_id: foundMarket.market_id,
        country: params.lng,
      },
      (response) => {
        setFilterIsLoading(false);
        setSportContent(response.data);
      }
    );
  };

  const isEmpty = !filterIsLoading && !sportContent?.competitions?.length;

  return (
    <div
      className={classNames("sport-container", {
        "sport-container-empty": isEmpty,
      })}
    >
      {name && (
        <div className="sport-competitions mx-3 mt-3">
          <div className="sport-competitions-head">
            <label className="sport-name">{name?.toUpperCase()}</label>
          </div>
          <div className="autoCompleteMultipleInRow mt-2">
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

            {slug !== "horseracing" && (
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
        </div>
      )}
      {marketOptions?.length > 0 && (
        <div className="mx-3">
          <TabsSelect
            data={marketOptions?.map((market) => ({
              label: market.market_name,
              id: market.market_id,
            }))}
            selectedItemId={selectedMarket?.id}
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
              type={slug}
            />
          ) : (
            <EmptyState message={t("sports.no_games_available")} />
          )}
        </>
      )}
    </div>
  );
};
