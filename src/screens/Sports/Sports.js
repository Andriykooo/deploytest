import axios from "axios";
import React, { useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { BaseLayout } from "../../components/baseLayout/BaseLayout";
import { AutocompleteSelect } from "../../components/custom/AutocompleteSelect";
import Footer from "../../components/footer/Footer";
import Matches from "../../components/matches/Matches";
import { SidebarLayout } from "../../components/sidebarLayout/SidebarLayout";
import { TabsSelect } from "../../components/tabsSelect/TabsSelect";
import { setCompetitions } from "../../store/actions";
import SkeletonComponent from "../../utils/SkeletonComponent";
import { alertToast } from "../../utils/alert";
import { apiUrl } from "../../utils/constants";
import "../Home/Home.css";
import "./Sports.css";

const Sports = () => {
  const [markets, setMarkets] = useState([]);
  const [message, setMessage] = useState("");
  const [marketId, setMarketId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectionTypes, setSelectionTypes] = useState([]);
  const [competitionsData, setComponetitionsData] = useState();
  const [selectCompetition, setSelectedCompetition] = useState(null);

  const sports = useSelector((state) => state.sports);
  const isMobile = useSelector((state) => state.setMobile);
  const { id } = useParams();
  const dispatch = useDispatch();

  const getCompetitions = (marketId) => {
    let url = `${apiUrl.NEXT_PUBLIC_GET_COMPETITIONS}?sportId=${id}&isLive=false`;
    if (marketId) {
      url = `${apiUrl.NEXT_PUBLIC_GET_COMPETITIONS}?sportId=${id}&marketId=${marketId}&isLive=false`;
    }

    axios
      .get(url)
      .then((result) => {
        let data = result?.data;
        setComponetitionsData(data);
        dispatch(setCompetitions(data));
        if (data.length < 1) {
          setMessage("There are no games available at the moment!");
        } else {
          setMessage("");
        }
      })
      .catch((err) => {
        alertToast({ message: err?.message });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const getMarkets = () => {
    setIsLoading(true);

    axios
      .get(`${apiUrl.NEXT_PUBLIC_MARKETS}/${id}`)
      .then((result) => {
        let data = result?.data;
        const sortedData = data.sort((a, b) => {
          return a.favorite && !b.favorite
            ? -1
            : !a.favorite && b.favorite
            ? 1
            : 0;
        });
        const favoriteMarkets = sortedData.filter(
          (marketRow) => marketRow.favorite
        );

        setMarkets(favoriteMarkets);
        setSelectionTypes(sortedData[0]?.selections || []);
        setMarketId(sortedData[0]?.market_id);
        getCompetitions(sortedData[0]?.market_id);
      })
      .catch((err) => {
        alertToast({ message: err?.message });
      });
  };

  useLayoutEffect(() => {
    getMarkets();
  }, [id]);

  return (
    <BaseLayout title="Sports" className="sportsBackground">
      <SidebarLayout left right className="sportsBackground">
        {isLoading ? (
          <SkeletonComponent isMobile={isMobile} />
        ) : (
          <>
            <div className="mainArticle">
              <div className="row w-100 sports-matches-container m-0 sportsMatchesContainer">
                <div className="col-12 sports-body ">
                  <div className="sport-competitions">
                    <label className="sport-name">
                      {sports
                        ?.find((sport) => sport.id === +id)
                        ?.name?.toUpperCase()}
                    </label>
                    <div className="autoCompleteMultipleInRow">
                      <AutocompleteSelect
                        placeholder={
                          id !== 15 ? "Select League" : "Competitions"
                        }
                        data={competitionsData.map((competition) => ({
                          label: competition.competition_name,
                          id: competition.competition_id,
                        }))}
                        onSelect={(item) => {
                          setSelectedCompetition(
                            competitionsData.find(
                              (competition) =>
                                competition?.competition_id === item?.id
                            )
                          );
                        }}
                      />
                      {id === 15 && (
                        <>
                          <AutocompleteSelect placeholder="Time" data={[]} />
                          <AutocompleteSelect placeholder="Region" data={[]} />
                          <AutocompleteSelect placeholder="Country" data={[]} />
                        </>
                      )}
                    </div>
                  </div>
                  {id !== 15 && markets?.length > 0 && (
                    <TabsSelect
                      data={markets.map((market) => ({
                        label: market.market_name,
                        id: market.market_id,
                      }))}
                      onChange={(selectedItem) => {
                        const selectedMarket = markets?.find((market) => {
                          return market.market_id === selectedItem.id;
                        });
                        setSelectionTypes(selectedMarket?.selections);
                        setMarketId(selectedMarket?.market_id);
                      }}
                      placeholder="Select market"
                    />
                  )}

                  {competitionsData?.length > 0 && (
                    <Matches
                      competitionsData={competitionsData.filter((competition) =>
                        selectCompetition
                          ? selectCompetition?.competition_id ===
                            competition.competition_id
                          : true
                      )}
                      selectionTypes={selectionTypes}
                      marketId={marketId}
                      id={id}
                      inPlay={false}
                      setComponetitionsData={setComponetitionsData}
                    />
                  )}
                  {message && <div className="messageStyle">{message}</div>}
                </div>
              </div>
            </div>
          </>
        )}
        <Footer />
      </SidebarLayout>
    </BaseLayout>
  );
};
export default Sports;