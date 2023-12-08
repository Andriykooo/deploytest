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
   null
  );
};
