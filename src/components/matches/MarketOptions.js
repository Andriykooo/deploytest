export const MarketOptions = ({ options }) => {
  return (
    <div className="matchCardRowContainer">
      <div className="matchCard selections">
        <div className="matchCardDate">Time</div>
        <div className="matchesContainer">
          <div className="eventStyle">Event</div>
        </div>
        <div className="odds">
          {options?.map((selection) => {
            return (
              <div
                key={selection.outcome_id}
                className={"selectionName firstSelection inPlayPlaceBet"}
              >
                {selection?.name}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
