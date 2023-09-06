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

export const Sport = ({ sportContent, setSportContent, slug }) => {
  const { gamingSocket } = useContext(SocketContext);
  const isMobile = useSelector((state) => state.setMobile);
  const language = useSelector((state) => state.language);

  const [filterIsLoading, setFilterIsLoading] = useState(true);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [selectedMarket, setSelectedMarket] = useState(
    sportContent?.market_options?.[0]
  );

  const name = useMemo(() => sportContent?.name, []);
  const marketOptions = useMemo(() => sportContent?.market_options, []);
  
  useEffect(() => {
    setFilterIsLoading(true);

    gamingSocket?.emit(
      "sport_content",
      {
        value: slug,
        market_id: selectedMarket ? selectedMarket.market_id : null,
        country: language?.code2,
      },
      (response) => {
        setFilterIsLoading(false);
        setSportContent(response.data);
      }
    );
  }, [selectedMarket, slug, language]);

  const isEmpty = !filterIsLoading && !sportContent?.competitions?.length;

  return (
    <div
      className={classNames("sport-container", {
        'sport-container-empty': isEmpty,
      })}
    >
      {name && (
        <div className="sport-competitions mx-3 mt-3">
          <div className="sport-competitions-head">
            <label className="sport-name">{name?.toUpperCase()}</label>
          </div>
          <div className="autoCompleteMultipleInRow mt-2">
            {sportContent?.competitions && (
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
            )}
            {slug !== "horseracing" && (
              <>
                <AutocompleteSelect placeholder="Region" data={[]} />
              </>
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
              setSelectedMarket(foundMarket);
            }}
            placeholder="Select market"
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
                (competition) =>
                  selectedCompetition
                    ? selectedCompetition.id === competition.id
                    : true
              )}
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
    </div>
  );
};
