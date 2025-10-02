import { Server as HTTPServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import type { Socket } from "socket.io";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from "@/types/socket";
import { gameManager } from "./GameManager";
import { SOCKET_EVENTS, ERROR_MESSAGES } from "@/utils/constants";
import { sanitizePlayerName } from "@/utils/gameHelpers";

let io: SocketIOServer<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
> | null = null;

export function initSocketServer(httpServer: HTTPServer) {
  io = new SocketIOServer<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(httpServer, {
    cors: {
      origin: process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_APP_URL
        : "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("✅ Client connected:", socket.id);

    // Create game
    socket.on(SOCKET_EVENTS.CREATE_GAME, ({ playerName, gameConfig }) => {
      try {
        console.log(`🎮 Creating game for player: ${playerName}`);
        const sanitizedName = sanitizePlayerName(playerName);
        const { game, player, code } = gameManager.createGame(
          sanitizedName,
          gameConfig?.maxPlayers || 6
        );

        // Store player and game info in socket
        socket.data.playerId = player.id;
        socket.data.gameCode = code;

        // Join socket room
        socket.join(code);

        console.log(`✅ Game created: ${code} by ${sanitizedName} (${player.id})`);

        // Send success response
        socket.emit(SOCKET_EVENTS.GAME_CREATED, {
          gameCode: code,
          playerId: player.id,
        });

        // Send initial game state
        const gameInfo = game.getGameInfo();
        socket.emit(SOCKET_EVENTS.GAME_STATE, {
          gameState: gameInfo.state,
          players: gameInfo.players,
        });
      } catch (error) {
        console.error("❌ Error creating game:", error);
        socket.emit(SOCKET_EVENTS.ERROR, {
          message: error instanceof Error ? error.message : "Failed to create game",
        });
      }
    });

    // Join game
    socket.on(SOCKET_EVENTS.JOIN_GAME, ({ gameCode, playerName }) => {
      try {
        console.log(`👤 Player ${playerName} trying to join game ${gameCode}`);
        const sanitizedName = sanitizePlayerName(playerName);
        const { game, player } = gameManager.joinGame(gameCode, sanitizedName);

        // Store player and game info
        socket.data.playerId = player.id;
        socket.data.gameCode = gameCode;

        // Join socket room
        socket.join(gameCode);

        console.log(`✅ Player ${sanitizedName} (${player.id}) joined game ${gameCode}`);

        // Notify player
        const gameInfo = game.getGameInfo();
        socket.emit(SOCKET_EVENTS.GAME_JOINED, {
          playerId: player.id,
          gameState: gameInfo.state,
          players: gameInfo.players,
        });

        // Notify other players
        socket.to(gameCode).emit(SOCKET_EVENTS.PLAYER_JOINED, {
          player: player.toPublicData(),
        });
      } catch (error) {
        console.error(`❌ Error joining game ${gameCode}:`, error);
        socket.emit(SOCKET_EVENTS.ERROR, {
          message: error instanceof Error ? error.message : ERROR_MESSAGES.GAME_NOT_FOUND,
        });
      }
    });

    // Player ready
    socket.on(SOCKET_EVENTS.PLAYER_READY, () => {
      const { playerId, gameCode } = socket.data;
      if (!playerId || !gameCode) return;

      try {
        const game = gameManager.getGame(gameCode);
        const player = game?.getPlayer(playerId);

        if (!player) throw new Error(ERROR_MESSAGES.INVALID_PLAYER);

        player.setReady(!player.isReady);

        // Notify all players
        io?.to(gameCode).emit(SOCKET_EVENTS.PLAYER_READY_UPDATE, {
          playerId,
          isReady: player.isReady,
        });
      } catch (error) {
        socket.emit(SOCKET_EVENTS.ERROR, {
          message: error instanceof Error ? error.message : "Failed to update ready status",
        });
      }
    });

    // Start game
    socket.on(SOCKET_EVENTS.START_GAME, () => {
      const { playerId, gameCode } = socket.data;
      if (!playerId || !gameCode) return;

      try {
        const game = gameManager.getGame(gameCode);
        const player = game?.getPlayer(playerId);

        if (!player?.isHost) {
          throw new Error("Only host can start the game");
        }

        game.start();

        // Send game state to all players
        const gameInfo = game.getGameInfo();

        // Send public game state to all
        io?.to(gameCode).emit(SOCKET_EVENTS.GAME_STARTED, {
          gameState: gameInfo.state,
          players: gameInfo.players,
        });

        // Send private hand to each player
        game.getPlayers().forEach((p) => {
          const playerSocket = Array.from(io?.sockets.sockets.values() || [])
            .find(s => s.data.playerId === p.id);

          if (playerSocket) {
            playerSocket.emit(SOCKET_EVENTS.GAME_STATE, {
              gameState: gameInfo.state,
              players: gameInfo.players.map(pub =>
                pub.id === p.id
                  ? { ...pub, hand: p.hand }
                  : pub
              ),
            });
          }
        });

      } catch (error) {
        socket.emit(SOCKET_EVENTS.ERROR, {
          message: error instanceof Error ? error.message : "Failed to start game",
        });
      }
    });

    // Play cards
    socket.on(SOCKET_EVENTS.PLAY_CARDS, ({ cards }) => {
      const { playerId, gameCode } = socket.data;
      if (!playerId || !gameCode) return;

      try {
        const game = gameManager.getGame(gameCode);
        if (!game) throw new Error(ERROR_MESSAGES.GAME_NOT_FOUND);

        game.playCards(playerId, cards);

        // Notify all players
        io?.to(gameCode).emit(SOCKET_EVENTS.CARDS_PLAYED, {
          playerId,
          cards,
        });

        // Send updated game state
        const gameInfo = game.getGameInfo();

        game.getPlayers().forEach((p) => {
          const playerSocket = Array.from(io?.sockets.sockets.values() || [])
            .find(s => s.data.playerId === p.id);

          if (playerSocket) {
            playerSocket.emit(SOCKET_EVENTS.GAME_STATE, {
              gameState: gameInfo.state,
              players: gameInfo.players.map(pub =>
                pub.id === p.id
                  ? { ...pub, hand: p.hand }
                  : pub
              ),
            });
          }
        });

        // Check if game ended
        if (game.getStatus() === "finished") {
          const rankings = game.getPlayers().map(p => ({
            playerId: p.id,
            rank: p.rank,
          }));

          io?.to(gameCode).emit(SOCKET_EVENTS.GAME_END, { rankings });
        } else {
          // Notify turn change
          io?.to(gameCode).emit(SOCKET_EVENTS.TURN_CHANGE, {
            currentPlayerId: game.getCurrentPlayer()?.id || "",
          });
        }

      } catch (error) {
        socket.emit(SOCKET_EVENTS.ERROR, {
          message: error instanceof Error ? error.message : "Invalid move",
        });
      }
    });

    // Pass turn
    socket.on(SOCKET_EVENTS.PASS_TURN, () => {
      const { playerId, gameCode } = socket.data;
      if (!playerId || !gameCode) return;

      try {
        const game = gameManager.getGame(gameCode);
        if (!game) throw new Error(ERROR_MESSAGES.GAME_NOT_FOUND);

        game.passTurn(playerId);

        // Notify all players
        io?.to(gameCode).emit(SOCKET_EVENTS.TURN_CHANGE, {
          currentPlayerId: game.getCurrentPlayer()?.id || "",
        });

        // Send updated game state
        const gameInfo = game.getGameInfo();
        io?.to(gameCode).emit(SOCKET_EVENTS.GAME_STATE, {
          gameState: gameInfo.state,
          players: gameInfo.players,
        });

      } catch (error) {
        socket.emit(SOCKET_EVENTS.ERROR, {
          message: error instanceof Error ? error.message : "Cannot pass turn",
        });
      }
    });

    // Leave game
    socket.on(SOCKET_EVENTS.LEAVE_GAME, () => {
      handlePlayerLeave(socket);
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
      handlePlayerLeave(socket);
    });
  });

  console.log("✅ Socket.IO server initialized");
  return io;
}

function handlePlayerLeave(socket: Socket) {
  const { playerId, gameCode } = socket.data;
  if (!playerId || !gameCode) return;

  const result = gameManager.removePlayer(playerId);

  if (result.game && result.gameCode) {
    // Notify other players
    socket.to(result.gameCode).emit(SOCKET_EVENTS.PLAYER_LEFT, {
      playerId,
    });

    // Leave socket room
    socket.leave(result.gameCode);
  }
}

export function getIO() {
  return io;
}
