// Sport
export const subscribeToSport = (socket, id) => {
    console.log("Subscribing to sport", id);
    socket.emit("subscribe_sport", {
      "value": id,
    });
};

export const unsubscribeToSport = (socket, id, uuid) => {
  console.log("Unsubscribing to sport", id);
  socket.emit("unsubscribe_sport", {
    "value": id,
    "action_id" : uuid
  });
};


// Competition
export const subscribeToCompetition = (socket, id, market_id) => {
    console.log("Subscribing to competition", id);
    socket.emit("subscribe_competition", {
      "value": id,
      "market_id": market_id || "0"
    });
};

export const unsubscribeToCompetition = (socket, id, uuid) => {
  console.log("Unsubscribing to competition", id);
  socket.emit("unsubscribe_competition", {
    "value": id,
    "action_id" : uuid
  });
}

// Market
export const subscribeToMarket = (socket, id) => {
  console.log("Subscribing to market", id);
  socket.emit("subscribe_match", {
    "value": id,
  });
};

export const unsubscribeToMarket = (socket, id, uuid) => {
  console.log("Unsubscribing to market", id);
  socket.emit("unsubscribe_market", {
    "value": id,
    "action_id" : uuid
  });
}


// Match
export const subscribeToMatch = (socket, id, market_id) => {
  console.log("Subscribing to match", id);
  socket.emit("subscribe_match", {
    "value": id,
    "market_id": market_id || "0"
  });
};

export const unsubscribeToMatch = (socket, id, uuid) => {
  console.log("Unsubscribing to match", id);
  socket.emit("unsubscribe_match", {
    "value": id,
    "action_id" : uuid
  });
}



