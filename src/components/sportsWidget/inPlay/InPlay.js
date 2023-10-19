import { SportsTable } from "../sportsTable/SportsTable";

export const InPlay = ({ data }) => {
  return data ? (
    <SportsTable data={data} title={data.title} type={data.widget_type} />
  ) : null;
};
