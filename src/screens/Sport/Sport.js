import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AutocompleteSelect } from "../../components/custom/AutocompleteSelect";
import { EmptyState } from "../../components/emptyState/EmptyState";
import Matches from "../../components/matches/Matches";
import { TabsSelect } from "../../components/tabsSelect/TabsSelect";
import { SocketContext } from "../../context/socket";
import SkeletonComponent from "../../utils/SkeletonComponent";
import "../Home/Home.css";
import "../Sports/Sports.css";

export const Sport = ({ sportContent, setSportContent, slug }) => {
  const { gamingSocket } = useContext(SocketContext);

  const isMobile = useSelector((state) => state.setMobile);
  const language = useSelector((state) => state.language);

  const [filterIsLoading, setFilterIsLoading] = useState(true);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [selectedMarket, setSelectedMarket] = useState(
    sportContent?.market_options?.[0]
  );

  useEffect(() => {
    if (selectedMarket) {
      setFilterIsLoading(true);

      gamingSocket?.emit(
        "sport_content",
        {
          value: slug,
          market_id: +selectedMarket.market_id,
          country: language?.code2,
        },
        (response) => {
          setFilterIsLoading(false);
          setSportContent(response.data);
        }
      );
    }
  }, [selectedMarket, slug, language]);

  return (
    <>
      <div className="sport-competitions m-3 mb-0">
        <label className="sport-name">
          {sportContent?.name?.toUpperCase()}
        </label>

        {sportContent?.competitions && (
          <div className="autoCompleteMultipleInRow mt-2">
            <AutocompleteSelect
              placeholder={"Competitions"}
              data={sportContent?.competitions?.map((competition) => ({
                label: competition.name,
                id: competition.id,
              }))}
              onSelect={(item) => {
                setSelectedCompetition(
                  sportContent?.competitions?.find(
                    (competition) => competition?.id === item?.id
                  )
                );
              }}
            />
            {slug === "football" && (
              <>
                <AutocompleteSelect placeholder="Time" data={[]} />
                <AutocompleteSelect placeholder="Region" data={[]} />
                <AutocompleteSelect placeholder="Country" data={[]} />
              </>
            )}
          </div>
        )}
      </div>
      {sportContent?.market_options?.length > 0 && (
        <div className="mx-3">
          <TabsSelect
            data={sportContent?.market_options?.map((market) => ({
              label: market.market_name,
              id: market.market_id,
            }))}
            selectedItemId={selectedMarket?.id}
            onChange={(selectedItem) => {
              const foundMarket = sportContent?.market_options?.find(
                (market) => {
                  return market.market_id === selectedItem.id;
                }
              );
              setSelectedMarket(foundMarket);
            }}
            placeholder="Select market"
          />
        </div>
      )}
      {filterIsLoading && <SkeletonComponent isMobile={isMobile} />}
      {!filterIsLoading && (
        <>
          {sportContent?.competitions?.length > 0 ? (
            <Matches
              competitionsData={sportContent?.competitions.filter(
                (competition) =>
                  selectedCompetition
                    ? selectedCompetition.id === competition.id
                    : true
              )}
              marketId={selectedMarket?.id}
              marketOptions={sportContent?.market_options}
              inPlay={false}
              type={slug}
            />
          ) : (
            <EmptyState
              message={"There are no games available at the moment!"}
            />
          )}
        </>
      )}
    </>
  );
};
