import { SportsTable } from "../sportsTable/SportsTable";

export const StartingSoon = ({ data }) => {
  return data ? <SportsTable data={data} type={data.widget_type} /> : null;
};
