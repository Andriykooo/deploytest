const OddsChange = ({ new_odds, old_odds }) => {
  new_odds = parseFloat(new_odds).toFixed(2);
  if (old_odds) old_odds = parseFloat(old_odds).toFixed(2);
  let type = "";
  if (new_odds > old_odds) {
    type = "up";
  } else if (new_odds < old_odds) {
    type = "down";
  } else {
    type = "same";
  }
  if (type === "up") {
    return (
      <span style={{ color: "green" }}>{old_odds + " > " + new_odds}</span>
    );
  } else if (type === "down") {
    return <span style={{ color: "red" }}>{old_odds + " > " + new_odds}</span>;
  } else {
    return <span>{new_odds}</span>;
  }
};

export default OddsChange;
