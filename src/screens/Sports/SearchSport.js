import { Autocomplete, Skeleton, TextField } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSportData } from "../../store/actions";
import { ArrowDownIcon } from "../../utils/icons";
import { useTranslations } from "next-intl";
function SearchSport({
  id,
  isLoading,
  competitionsData,
  filterCompetitions,
  markets,
  setSelectionTypes,
  setMarketId,
  setMarketName,
  openedMarkets,
  marketOptionRef,
  setValue,
  setOpenedMarkets,
}) {
  const t = useTranslations();
  let activeSport = useSelector((state) => state.activeSport);
  let isMobile = useSelector((state) => state.isMobile);
  const dispatch = useDispatch();
  const sportsData = useSelector((state) => state.sportsData);
  let comp_id = sportsData?.competition_id;
  var competition;
  if (competitionsData && competitionsData.length > 0) {
    competition = competitionsData.find(
      (comp) => comp.competition_id === comp_id
    );
  }
  return (
    <>
      {id !== 15 ? (
        <>
          <div className="select-competition-container">
            {!isLoading && activeSport ? <></> : null}
            {isMobile &&
              activeSport &&
              (!isLoading ? (
                <>
                  <Skeleton
                    variant="rectangular"
                    sx={{ fontSize: "1.2rem", bgcolor: "#212536" }}
                    animation="wave"
                    key={Math.random()}
                  />
                </>
              ) : (
                <div className="footballContainerSports"></div>
              ))}
            {openedMarkets && (
              <div
                className={
                  openedMarkets
                    ? "competitions-options markets-options opened"
                    : "competitions-options markets-options"
                }
                ref={marketOptionRef}
              >
                {markets.map((row, index) => {
                  return (
                    <span
                      className="competition-option"
                      key={row?.market_id}
                      onClick={() => {
                        setSelectionTypes(row?.selections);
                        setValue(index);
                        setMarketId(row.market_id);
                        setOpenedMarkets(false);
                        dispatch(
                          setSportData({
                            type: "market_id",
                            value: row.market_id,
                          })
                        );
                      }}
                    >
                      {row?.market_name}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="autoCompleteMultipleInRow"></div>
      )}
    </>
  );
}
export default SearchSport;
