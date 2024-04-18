import { SelectButtons } from "../selectButtons/SelectsButtons";
import "./EventsFilter.css";

export const EventsFilter = ({ options, onSelect, selectedId, noSpace }) => {
  return (
    <div className={`events-filters ${noSpace ? "p-0" : ""}`}>
      <SelectButtons
        data={options}
        selectedId={selectedId}
        onSelect={onSelect}
        borders
      />
    </div>
  );
};
