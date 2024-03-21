import { SportsTable } from "../sportsTable/SportsTable";

export const StartingSoon = ({ data }) => {
  const options = data?.sports?.map((sport) => ({
    ...sport,
    name: sport.name,
  })).filter((item) => !!item.competitions.length && !!item.market_options.length);

  const startingSoonData = {
    ...data,
    sports: options
  }
  return data ?
    <SportsTable
      data={startingSoonData}
      type={data.widget_type}
      disableCta
    /> : null;
};
