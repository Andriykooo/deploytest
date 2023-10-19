export const MarketOptions = ({ options }) => {
  return (
    <div className="matchCardRowContainer">
      <div className="matchCard selections">
        <div className="matchCardDate">Time</div>
        <div className="matchesContainer">
          <div className="eventStyle">Event</div>
        </div>
        <div className="odds">
          {options?.map((selection, index) => {
            return (
              <div
                key={selection?.outcome_id || index}
                className={"selectionName firstSelection inPlayPlaceBet"}
              >
                {selection?.outcome_name || selection.name}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
