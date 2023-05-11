import { Autocomplete, Skeleton, TextField } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSportData } from "../../store/actions";
import { ArrowDownIcon } from "../../utils/icons";
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
            {!isLoading && activeSport ? (
              <>
                <Skeleton
                  variant="rectangular"
                  sx={{ fontSize: "1.2rem", bgcolor: "#212536" }}
                  animation="wave"
                  key={Math.random()}
                />
              </>
            ) : (
              <Autocomplete
                disablePortal
                popupIcon={<ArrowDownIcon />}
                id="autocomplete-competition"
                options={competitionsData}
                sx={{ maxWidth: 350, height: "50px", color: "white" }}
                getOptionLabel={(option) => option.competition_name}
                renderInput={(params) => (
                  <TextField
                    placeholder={
                      competition?.competition_name
                        ? competition?.competition_name
                        : "Select League"
                    }
                    {...params}
                    variant="outlined"
                  />
                )}
                onChange={(event, newValue, reason) => {
                  if (reason === "clear") {
                    filterCompetitions(0);
                    dispatch(
                      setSportData({
                        type: "competition_id",
                        value: 0,
                      })
                    );
                  } else {
                    filterCompetitions(newValue?.competition_id);
                    dispatch(
                      setSportData({
                        type: "competition_id",
                        value: newValue?.competition_id,
                      })
                    );
                  }
                }}
              />
            )}
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
                <div className="footballContainerSports">
                  <Autocomplete
                    disablePortal
                    popupIcon={<ArrowDownIcon />}
                    id="autocomplete-market"
                    options={markets}
                    sx={{ maxWidth: 350, height: "50px", color: "white" }}
                    getOptionLabel={(option) => option.market_name}
                    renderInput={(params) => (
                      <TextField
                        placeholder="Select bet"
                        {...params}
                        variant="outlined"
                      />
                    )}
                    onChange={(event, newValue, reason) => {
                      if (reason === "clear") {
                        if (markets.length > 0) {
                          setSelectionTypes(markets[0]?.selections);
                          setMarketId(markets[0]?.market_id);
                          setMarketName(markets[0]?.market_name);
                          dispatch(
                            setSportData({
                              type: "market_id",
                              value: markets[0]?.market_id,
                            })
                          );
                        }
                      } else {
                        setSelectionTypes(newValue?.selections);
                        setMarketId(newValue.market_id);
                        setMarketName(newValue.market_name);
                        dispatch(
                          setSportData({
                            type: "market_id",
                            value: newValue.market_id,
                          })
                        );
                      }
                    }}
                  />
                </div>
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
        <div className="autoCompleteMultipleInRow">
          <div className="selectCompetition">
            <Autocomplete
              disablePortal
              popupIcon={<ArrowDownIcon />}
              id="autocomplete-market"
              options={markets}
              sx={{ height: "50px", color: "white" }}
              getOptionLabel={(option) => option.market_name}
              renderInput={(params) => (
                <TextField
                  placeholder="Competetion"
                  {...params}
                  variant="outlined"
                />
              )}
              onChange={(event, newValue, reason) => {
                if (reason === "clear") {
                  if (markets.length > 0) {
                    setSelectionTypes(markets[0]?.selections);
                    setMarketId(markets[0]?.market_id);
                    setMarketName(markets[0]?.market_name);
                    dispatch(
                      setSportData({
                        type: "market_id",
                        value: markets[0]?.market_id,
                      })
                    );
                  }
                } else {
                  setSelectionTypes(newValue?.selections);
                  setMarketId(newValue.market_id);
                  setMarketName(newValue.market_name);
                  dispatch(
                    setSportData({
                      type: "market_id",
                      value: newValue.market_id,
                    })
                  );
                }
              }}
            />
          </div>
          <div className="timeCompetition">
            <Autocomplete
              disablePortal
              popupIcon={<ArrowDownIcon />}
              id="autocomplete-market"
              options={markets}
              sx={{ maxWidth: 350, height: "50px", color: "white" }}
              getOptionLabel={(option) => option.market_name}
              renderInput={(params) => (
                <TextField placeholder="Time" {...params} variant="outlined" />
              )}
              onChange={(event, newValue, reason) => {
                if (reason === "clear") {
                  if (markets.length > 0) {
                    setSelectionTypes(markets[0]?.selections);
                    setMarketId(markets[0]?.market_id);
                    setMarketName(markets[0]?.market_name);
                  }
                } else {
                  setSelectionTypes(newValue?.selections);
                  setMarketId(newValue.market_id);
                  setMarketName(newValue.market_name);
                }
              }}
            />
          </div>
          <div className="regionCompetiton">
            <Autocomplete
              disablePortal
              popupIcon={<ArrowDownIcon />}
              id="autocomplete-market"
              options={markets}
              sx={{ maxWidth: 350, height: "50px", color: "white" }}
              getOptionLabel={(option) => option.market_name}
              renderInput={(params) => (
                <TextField
                  placeholder="Region"
                  {...params}
                  variant="outlined"
                />
              )}
              onChange={(event, newValue, reason) => {
                if (reason === "clear") {
                  if (markets.length > 0) {
                    setSelectionTypes(markets[0]?.selections);
                    setMarketId(markets[0]?.market_id);
                    setMarketName(markets[0]?.market_name);
                  }
                } else {
                  setSelectionTypes(newValue?.selections);
                  setMarketId(newValue.market_id);
                  setMarketName(newValue.market_name);
                }
              }}
            />
          </div>
          <div className="countryCompetition">
            <Autocomplete
              disablePortal
              popupIcon={<ArrowDownIcon />}
              id="autocomplete-market"
              options={markets}
              sx={{ maxWidth: 350, height: "50px", color: "white" }}
              getOptionLabel={(option) => option.market_name}
              renderInput={(params) => (
                <TextField
                  placeholder="Country"
                  {...params}
                  variant="outlined"
                />
              )}
              onChange={(event, newValue, reason) => {
                if (reason === "clear") {
                  if (markets.length > 0) {
                    setSelectionTypes(markets[0]?.selections);
                    setMarketId(markets[0]?.market_id);
                    setMarketName(markets[0]?.market_name);
                  }
                } else {
                  setSelectionTypes(newValue?.selections);
                  setMarketId(newValue.market_id);
                  setMarketName(newValue.market_name);
                }
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
export default SearchSport;
