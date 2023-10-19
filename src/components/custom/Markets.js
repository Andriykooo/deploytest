import { Box, Tab, Tabs } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

export const Markets = ({
  openedMarkets,
  marketOptionRef,
  markets,
  setSelectionTypes,
  setValue,
  setMarketId,
  setOpenedMarkets,
  isLoading,
  setSportData,
  value,
  handleChange,
}) => {
  const isMobile = useSelector((state) => state.setMobile);
  let activeSport = useSelector((state) => state.activeSport);
  const dispatch = useDispatch();
  return (
    <>
      {" "}
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
                }}
              >
                {row?.market_name}
              </span>
            );
          })}
        </div>
      )}
      {/* Desktop Markets */}
      {!isMobile && (
        <div
          className={
            !isLoading ? "markets-container d-flex" : "markets-container"
          }
        >
          {activeSport && (
            <Box>
              <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
              >
                {markets.map((row, i) => {
                  return (
                    <Tab
                      label={row.market_name}
                      sx={{ color: "#FFFFFF" }}
                      key={i}
                      onClick={() => {
                        setValue(i);
                        setMarketId(row?.market_id);
                        if (setSportData) {
                          dispatch(
                            setSportData({
                              type: "market_id",
                              value: row.market_id,
                            })
                          );
                        }
                      }}
                    />
                  );
                })}
              </Tabs>
            </Box>
          )}
        </div>
      )}
    </>
  );
};
