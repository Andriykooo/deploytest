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
  ).map(([label, options]) => ({ label, options }));
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

export const calculateMatchTime = (match) => {
  let time;
  if (match?.current_phase === "FirstHalf") {
    time = moment.utc().format("h:mm:ss a");
  } else if (match?.current_phase === "SecondHalf") {
    time = moment().format("h:mm:ss a");
  }

  let MatchFullYear = match.match_start_time_utc?.split(" ")[0];
  let monthOfMatch = MatchFullYear?.split("-")[1];
  let dateOfMatch = MatchFullYear?.split("-")[2];
  let fullDateOFMatch = monthOfMatch + "-" + Number(dateOfMatch);
  let today = new Date();
  let month = [];
  let dateToday = today.getDate();
  month[0] = "01";
  month[1] = "02";
  month[2] = "03";
  month[3] = "04";
  month[4] = "05";
  month[5] = "06";
  month[6] = "07";
  month[7] = "08";
  month[8] = "09";
  month[9] = "10";
  month[10] = "11";
  month[11] = "12";

  let monthNumber = month[today.getMonth()];
  let todayDate = monthNumber + "-" + dateToday;
  let liveTime = "";
  if (
    match.current_phase === "FirstHalf" ||
    match.current_phase === "SecondHalf"
  ) {
    if (todayDate === fullDateOFMatch) {
      let total;
      if (match.current_phase === "SecondHalf") {
        total = moment
          .utc(match?.match_details?.StartTimes?.SecondHalf)
          .format("DD-MM-YYYY HH:mm:ss")
          ?.split(" ")[1];
      } else {
        total = moment
          .utc(match?.match_details?.StartTimes?.FirstHalf)
          .format("DD-MM-YYYY HH:mm:ss")
          ?.split(" ")[1];
      }
      let newTime;
      if (time?.split(" ")[1] === "pm") {
        time += 12;
        newTime =
          Number(time?.split(" ")[0]?.split(":")[0]) +
          12 +
          ":" +
          time?.split(" ")[0]?.split(":")[1] +
          ":" +
          Number(time?.split(" ")[0]?.split(":")[2]);
      } else newTime = time;
      if (match.current_phase === "FirstHalf") {
        if (Number(newTime?.split(":")[0]) > Number(total?.split(":")[0])) {
          let hour =
            Number(newTime?.split(":")[0]) - Number(total?.split(":")[0]);
          let minutes;
          if (total?.split(":")[1] > newTime?.split(":")[1]) {
            minutes = total?.split(":")[1] + newTime?.split(":")[1];
          } else {
            minutes =
              Number(newTime?.split(":")[1]) - Number(total?.split(":")[1]);
          }
          liveTime = hour * 60 + minutes;
        } else if (
          Number(newTime?.split(":")[0]) === Number(total?.split(":")[0])
        ) {
          liveTime =
            Number(newTime?.split(":")[1]) - Number(total?.split(":")[1]);
        }
      } else if (
        Number(newTime?.split(":")[0]) > Number(total?.split(":")[0])
      ) {
        let minutes =
          Number(total?.split(":")[1]) + 60 - Number(newTime?.split(":")[1]);
        liveTime = 45 + Number(minutes);
      }
    }
  } else if (match.current_phase === "PreMatch") {
    liveTime = "PreMatch";
  } else if (match.current_phase === "Penalties") {
    liveTime = "Penalties";
  } else if (match.current_phase === "ExtraTimeFirstHalf") {
    liveTime = "Extra Time FirstHalf";
  } else if (match.current_phase === "ExtraTimeSecondHalf") {
    liveTime = "Extra Time SecondHalf";
  } else if (match.current_phase === "FullTimeExtraTime") {
    liveTime = "Full Time Extra Time";
  } else if (match.current_phase === "MatchAbandoned") {
    liveTime = "Match Abandoned";
  } else if (match.current_phase === "HalfTime") {
    liveTime = "HalfTime";
  } else if (match.current_phase === "SecondHalfTime") {
    liveTime = "SecondHalfTime";
  } else if (match.current_phase === "FirstQuarter") {
    liveTime = "FirstQuarter";
  } else if (match.current_phase === "SecondQuarter") {
    liveTime = "SecondQuarter";
  } else if (match.current_phase === "ThirdQuarter") {
    liveTime = "ThirdQuarter";
  } else if (match.current_phase === "FourthQuarter") {
    liveTime = "FourthQuarter";
  }
  return liveTime;
};

export const calculateMatchTimeOfIceHockeyAndBasketball = (
  match,
  id,
  competitionName
) => {
  //name of nba National Basketball Association
  let time;
  if (
    match?.current_phase === "FirstPeriod" ||
    match?.current_phase === "SecondPeriod" ||
    match?.current_phase === "ThirdPeriod" ||
    match?.current_phase === "FirstQuarter" ||
    match?.current_phase === "SecondQuarter" ||
    match?.current_phase === "ThirdQuarter" ||
    match?.current_phase === "FourthQuarter"
  ) {
    time = moment().format("h:mm:ss a");
  }
  let MatchFullYear = match.match_start_time_utc?.split(" ")[0];
  let monthOfMatch = MatchFullYear?.split("-")[1];
  let dateOfMatch = MatchFullYear?.split("-")[2];
  let fullDateOFMatch = monthOfMatch + "-" + Number(dateOfMatch);
  let today = new Date();
  let month = [];
  let dateToday = today.getDate();
  month[0] = "01";
  month[1] = "02";
  month[2] = "03";
  month[3] = "04";
  month[4] = "05";
  month[5] = "06";
  month[6] = "07";
  month[7] = "08";
  month[8] = "09";
  month[9] = "10";
  month[10] = "11";
  month[11] = "12";

  let monthNumber = month[today.getMonth()];
  let todayDate = monthNumber + "-" + Number(dateToday);
  let liveTime = "";
  if (
    match.current_phase === "FirstPeriod" ||
    match.current_phase === "SecondPeriod" ||
    match.current_phase === "ThirdPeriod" ||
    match.current_phase === "FirstQuarter" ||
    match.current_phase === "SecondQuarter" ||
    match.current_phase === "ThirdQuarter" ||
    match.current_phase === "FourthQuarter" ||
    match.current_phase === "OverTimePeriod" ||
    match.current_phase === "OverTimeQuarter"
  ) {
    if (todayDate === fullDateOFMatch) {
      if (time?.split(" ")[1] === "pm") {
        time += 12;
      }
      let gameInSeconds;
      if (match?.time_remaining_in_phase > 0) {
        let allTimeInSeconds = match?.time_remaining_in_phase / 1000;
        let allGameTimeInSeconds;
        if (id === 15 && match.current_phase === "OverTimePeriod") {
          allGameTimeInSeconds = 300;
        } else if (id !== 15 && match.current_phase === "OverTimeQuarter") {
          allGameTimeInSeconds = 300;
        } else if (id === 15) {
          allGameTimeInSeconds = 1200;
        } else if (
          id === 4 &&
          competitionName.toLocaleLowerCase().indexOf("nba") > -1
        ) {
          allGameTimeInSeconds = 720;
        } else {
          allGameTimeInSeconds = 600;
        }
        gameInSeconds = allGameTimeInSeconds - allTimeInSeconds;
        let minutes = Math.floor(gameInSeconds / 60) + "'";
        let remainingSeconds = (gameInSeconds % 60) + '"';
        let gameCurrentPhase = match?.current_phase;
        let periodOfIceHockeyGame;
        if (id === 15) {
          if (gameCurrentPhase === "FirstPeriod") {
            periodOfIceHockeyGame = "P1";
          } else if (gameCurrentPhase === "SecondPeriod") {
            periodOfIceHockeyGame = "P2";
          } else if (gameCurrentPhase === "OverTimePeriod") {
            periodOfIceHockeyGame = "Overtime";
          } else {
            periodOfIceHockeyGame = "P3";
          }
          liveTime =
            periodOfIceHockeyGame + " " + minutes + " " + remainingSeconds;
        } else {
          if (gameCurrentPhase === "FirstQuarter") {
            periodOfIceHockeyGame = "Q1";
          } else if (gameCurrentPhase === "SecondQuarter") {
            periodOfIceHockeyGame = "Q2";
          } else if (gameCurrentPhase === "ThirdQuarter") {
            periodOfIceHockeyGame = "Q3";
          } else if (gameCurrentPhase === "OverTimeQuarter") {
            periodOfIceHockeyGame = "Overtime";
          } else {
            periodOfIceHockeyGame = "Q4";
          }
          liveTime =
            periodOfIceHockeyGame + " " + minutes + " " + remainingSeconds;
        }
      }
    }
  } else if (match.current_phase === "EndOfFirstPeriod") {
    liveTime = "End Of First Period";
  } else if (match.current_phase === "EndOfSecondPeriod") {
    liveTime = "End Of Second Period";
  } else if (match.current_phase === "EndOfThirdPeriod") {
    liveTime = "End Of Third Period";
  } else if (match.current_phase === "OvertimePeriod") {
    liveTime = "Overtime";
  } else if (match.current_phase === "EndOfOvertimePeriod") {
    liveTime = "End Of Overtime Period";
  } else if (match.current_phase === "PenaltyShootout") {
    liveTime = "Penalties";
  } else if (match.current_phase === "EndOfPenaltyShootout") {
    liveTime = "End of penalties";
  } else if (match.current_phase === "Suspended") {
    liveTime = "Suspended";
  } else if (match.current_phase === "Abandoned") {
    liveTime = "Abandoned";
  } else if (match.current_phase === "PostMatch") {
    liveTime = "PostMatch";
  } else if (match.current_phase === "PreGame") {
    liveTime = "Pregame";
  }
  return liveTime;
};
export const calculateMatchDayAndHour = (match, type) => {
  let hourOfMatch;
  let dayOfTheMatch;

  if (match?.match_start_time_utc) {
    if (match?.match_start_time_utc.indexOf(" ") > -1) {
      let convertedTime = formatToLocalDatetime(match?.match_start_time_utc);
      if (convertedTime && convertedTime !== "-") {
        hourOfMatch = convertedTime.format("HH:mm");
        dayOfTheMatch = convertedTime.format("DD MMM");
      } else {
        hourOfMatch = "-";
        dayOfTheMatch = "-";
      }
    }
  }
  if (type === "hour") {
    return hourOfMatch;
  } else {
    return dayOfTheMatch;
  }
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
