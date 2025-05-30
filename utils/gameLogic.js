const userSocketMap = new Map();
const games = new Map();
const gamesId = new Map();
class GameState {
  constructor(id, player1id, player2id) {
    this.id = id;
    this.firstPlayer = player1id;
    this.secondPlayer = player2id;
    this.currentPlayer = player1id; // By default, player 1 starts the game
  }
}

function getUserIdBySocketId(socketId) {
  for (const [userId, id] of userSocketMap.entries()) {
    if (id === socketId) {
      return userId; // Return the userId if the socketId matches
    }
  }
  return null; // Return null if the socketId is not found in the map
}

const initGame = (io) => {
  io.on("connection", (socket) => {
    console.log("Client connected");

    socket.on("setUserId", (userId) => {
      // Save the mapping between user ID and socket ID
      userSocketMap.set(userId, socket.id);

      // Emit updated user socket map to all clients
      io.emit("updateUserSocketMap", Array.from(userSocketMap));
    });

    socket.on("message", (message) => {
      // Broadcast the message to all connected clients
      io.emit("message", message);
    });

    socket.on("play request", (userId) => {
      const secondSocketId = userSocketMap.get(userId);
      if (secondSocketId !== socket.id) {
        const firstPlayer = getUserIdBySocketId(socket.id);
        io.to(secondSocketId).emit("play request 2", firstPlayer);
      }
    });

    socket.on("accept request", (firstPlayer, userId) => {
      const firstSocketId = userSocketMap.get(firstPlayer);
      playSomeGame(io, socket, firstPlayer, userId, firstSocketId);
    });

    socket.on("update game state", (gameState) => {
      const firstPlayer = gameState.firstPlayer;
      gameState.currentPlayer =
        gameState.currentPlayer === firstPlayer
          ? gameState.secondPlayer
          : firstPlayer;
      games.set(gameState.id, gameState);

      const socketIds = [
        userSocketMap.get(gameState.firstPlayer),
        userSocketMap.get(gameState.secondPlayer),
      ];
      socketIds.forEach((socketId) => {
        io.to(socketId).emit("game status", gameState);
      });
    });

    socket.on("test export", () => {
      console.log("test export");
    });
    socket.on("update korki", ({ korkiState, gameId }) => {
      io.emit("update korki", korkiState);
    });
    // socket.emit("hello");

    socket.on("disconnect", () => {
      console.log("Client disconnected");
      disconnectPlayer(io, socket);
    });
  });
};

const playSomeGame = (io, socket, firstPlayer, secondPlayer, firstSocketId) => {
  if (
    gamesId.get(firstPlayer) === undefined &&
    gamesId.get(secondPlayer) === undefined
  ) {
    const gamesSize = games.size + 1;
    games.set(gamesSize, new GameState(gamesSize, firstPlayer, secondPlayer));
    const socketIds = [firstSocketId, socket.id];
    socketIds.forEach((socketId) => {
      io.to(socketId).emit("game status", games.get(gamesSize));
    });
    gamesId.set(firstPlayer, gamesSize);
    gamesId.set(secondPlayer, gamesSize);
  }
  // else if (gamesId.get(firstPlayer) === gamesId.get(secondPlayer)) {
  //   const gameObj = games.get(gamesId.get(firstPlayer));
  //   gameObj.currentPlayer =
  //     gameObj.currentPlayer === firstPlayer ? secondPlayer : firstPlayer;
  //   games.set(firstPlayer, gameObj);
  // }
};

const disconnectPlayer = (io, socket) => {
  userSocketMap.forEach((value, key) => {
    if (value === socket.id) {
      userSocketMap.delete(key);
    }
  });

  io.emit("updateUserSocketMap", Array.from(userSocketMap));
};
module.exports = { initGame, disconnectPlayer };
