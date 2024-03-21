import { SportsTable } from "../sportsTable/SportsTable";

export const InPlay = ({ data }) => {

  const options = data?.sports?.map((sport) => ({
    ...sport,
    name: sport.name,
  })).filter((item) => !!item.competitions.length && !!item.market_options.length);

  const inPlayData = {
    ...data,
    sports: options
  }

  return data ? (
    <SportsTable
      data={inPlayData}
      title={data.title}
      type={data.widget_type}
      disableCta
    />
  ) : null;
};
