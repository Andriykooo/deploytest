import { SelectButtons } from "../selectButtons/SelectsButtons";
import "./EventsFilter.css";

export const EventsFilter = ({ options, onSelect, selectedId }) => {
  return (
    <div className="events-filters">
      <SelectButtons
        data={options}
        selectedId={selectedId}
        onSelect={onSelect}
        borders
      />
    </div>
  );
};
