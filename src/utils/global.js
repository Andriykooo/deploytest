import moment from "moment";

export const groupObjectsBySameValue = (array) => {
  return Object.entries(
    array.reduce(
      (
        acc,
        { bet_id, market_id, market_name, odds_decimal, selection_name }
      ) => {
        // Group initialization
        if (!acc[market_name]) {
          acc[market_name] = [];
        }

        acc[market_name].push({
          bet_id,
          market_id,
          odds_decimal,
          selection_name,
        });

        return acc;
      },
      {}
    )
  ).map(([label, options]) => ({
    label,
    id: options?.[0]?.market_id,
    options,
  }));
};

export const formatToLocalDatetime = (datetime) => {
  if (datetime) {
    return moment.utc(datetime).local();
  }
  return "-";
};
export const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  let formattedTime = "";
  if (hours > 0) {
    formattedTime += `${hours} hour${hours !== 1 ? "s" : ""}, `;
  }
  if (minutes > 0) {
    formattedTime += `${minutes} minute${minutes !== 1 ? "s" : ""}, `;
  }
  formattedTime += `${remainingSeconds} second${
    remainingSeconds !== 1 ? "s" : ""
  }`;
  return formattedTime;
};

export const sportSubscriber = (data) => {
  for (let i = 0; i < data.length; i++) {
    let selection = data[i]?.data;
    let betId = selection?.bet_id;
    let odd = selection?.odds_decimal;
    // filter competition
    if (document.getElementById("bet_odds_" + betId)) {
      let dataOdds = document
        .getElementById("bet_odds_" + betId)
        .getAttribute("data-value");
      let changeClass = `up`;
      if (Number(odd).toFixed(2) < Number(dataOdds).toFixed(2)) {
        changeClass = `down`;
      }
      if (Number(odd).toFixed(2) !== Number(dataOdds).toFixed(2)) {
        document.getElementById("bet_odds_" + betId).innerHTML =
          selection?.odds_decimal.toFixed(2);
        document
          .getElementById("bet_odds_" + betId)
          .classList.add("odds-change", changeClass);
        document
          .getElementById("bet_odds_" + betId)
          .setAttribute("data-value", selection?.odds_decimal.toFixed(2));
        setTimeout(() => {
          document
            .getElementById("bet_odds_" + betId)
            .classList.remove("odds-change", changeClass);
        }, 5000);
      }
    }
  }
};

export const competitionSubscriber = (data) => {
  for (let i = 0; i < data.length; i++) {
    let selection = data[i]?.data;
    let betId = selection?.bet_id;
    let odd = selection?.odds_decimal;
    if (document.getElementById("bet_odds_" + betId)) {
      let dataOdds = document
        .getElementById("bet_odds_" + betId)
        .getAttribute("data-value");
      let changeClass = `up`;
      if (Number(odd).toFixed(2) < Number(dataOdds).toFixed(2)) {
        changeClass = `down`;
      }
      if (Number(odd).toFixed(2) !== Number(dataOdds).toFixed(2)) {
        document.getElementById("bet_odds_" + betId).innerHTML =
          selection?.odds_decimal.toFixed(2);
        document
          .getElementById("bet_odds_" + betId)
          .classList.add("odds-change", changeClass);
        document
          .getElementById("bet_odds_" + betId)
          .setAttribute("data-value", selection?.odds_decimal.toFixed(2));
        setTimeout(() => {
          document
            .getElementById("bet_odds_" + betId)
            .classList.remove("odds-change", changeClass);
        }, 5000);
      }
    }
  }
};

export const marketSubscriber = (data) => {
  for (let i = 0; i < data.length; i++) {
    let selection = data[i]?.data;
    let betId = selection?.bet_id;
    let odd = selection?.odds_decimal;
    if (document.getElementById("bet_odds_" + betId)) {
      let dataOdds = document
        .getElementById("bet_odds_" + betId)
        .getAttribute("data-value");
      let changeClass = `up`;
      if (Number(odd).toFixed(2) < Number(dataOdds).toFixed(2)) {
        changeClass = `down`;
      }
      if (Number(odd).toFixed(2) !== Number(dataOdds).toFixed(2)) {
        document.getElementById("bet_odds_" + betId).innerHTML =
          selection?.odds_decimal.toFixed(2);
        document
          .getElementById("bet_odds_" + betId)
          .classList.add("odds-change", changeClass);
        document
          .getElementById("bet_odds_" + betId)
          .setAttribute("data-value", selection?.odds_decimal.toFixed(2));
        setTimeout(() => {
          document
            .getElementById("bet_odds_" + betId)
            .classList.remove("odds-change", changeClass);
        }, 5000);
      }
    }
  }
};

export const changeCompetitionsDataOnSportSubscribe = (
  messageRow,
  competitions
) => {
  let selection = messageRow;
  let betId = selection?.bet_id;
  let competitionId = selection?.competition_id;
  let matchId = selection?.match_id;
  let newOdds = selection?.odds_decimal;
  let filteredSelection = {};
  // filter competition
  let filteredCompetition = competitions.filter(
    (row) => row.competition_id.toString() === competitionId.toString()
  );
  if (filteredCompetition && filteredCompetition.length > 0) {
    let matches = filteredCompetition[0]?.matches;
    // filter match
    let filteredMatch = matches.filter(
      (row) => row.match_id.toString() === matchId.toString()
    );
    if (filteredMatch && filteredMatch.length > 0) {
      let selections = filteredMatch[0]?.selections;
      //filter selection
      filteredSelection = selections.filter(
        (row) => row.bet_id.toString() === betId.toString()
      );
      if (filteredSelection && filteredSelection.length > 0) {
        let odd = filteredSelection[0].odds_decimal;
        filteredSelection[0].old_odds = odd;
        filteredSelection[0].new_odds = newOdds;
        if (Number(odd).toFixed(2) < Number(newOdds).toFixed(2)) {
          filteredSelection[0].type = "dec";
        } else {
          filteredSelection[0].type = "inc";
        }
      }
    }
  }
  return filteredSelection;
};

export const formatOdd = (selection, format) => {
  if (selection?.trading_status === "suspended") {
    return "SUSP";
  }

  if (format === "straight") {
    // Straight don't have a meaning in PlatBook platform, this should be used only for predictions.
    // Straight is means : Stake * Odds = Return
    return selection?.odds_decimal || "-";
  }

  if (format === "decimal") {
    return selection.odds_decimal || "-";
  }

  if (format === "fractional") {
    return selection.odds_fractional || "-";
  }

  if (format === "american") {
    return selection.odds_american || "-";
  }

  return (
    selection?.odds_decimal ||
    selection?.odds_fractional ||
    selection?.odds_american ||
    "-"
  );
};
