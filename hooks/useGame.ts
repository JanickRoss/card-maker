"use client";

import { useEffect } from "react";
import { useSocket } from "./useSocket";
import { useGameStore } from "@/lib/store/gameStore";
import { SOCKET_EVENTS } from "@/utils/constants";
import { Card } from "@/types/game";

export function useGame() {
  const socket = useSocket();
  const {
    gameState,
    players,
    currentPlayerId,
    myPlayerId,
    myHand,
    setGameState,
    setPlayers,
    setCurrentPlayer,
    setMyPlayerId,
    setMyHand,
    updatePlayerReady,
    addPlayer,
    removePlayer,
  } = useGameStore();

  useEffect(() => {
    if (!socket) return;

    // Game created
    socket.on(SOCKET_EVENTS.GAME_CREATED, ({ gameCode, playerId }) => {
      setMyPlayerId(playerId);
      // Save to localStorage for reconnection
      localStorage.setItem('gameCode', gameCode);
      localStorage.setItem('playerId', playerId);
    });

    // Game joined
    socket.on(SOCKET_EVENTS.GAME_JOINED, ({ playerId, gameState, players }) => {
      setMyPlayerId(playerId);
      setGameState(gameState);
      setPlayers(players);
      // Save to localStorage for reconnection
      localStorage.setItem('gameCode', gameState.code);
      localStorage.setItem('playerId', playerId);
    });

    // Player joined
    socket.on(SOCKET_EVENTS.PLAYER_JOINED, ({ player }) => {
      addPlayer(player);
    });

    // Player left
    socket.on(SOCKET_EVENTS.PLAYER_LEFT, ({ playerId }) => {
      removePlayer(playerId);
    });

    // Player ready update
    socket.on(SOCKET_EVENTS.PLAYER_READY_UPDATE, ({ playerId, isReady }) => {
      updatePlayerReady(playerId, isReady);
    });

    // Game started
    socket.on(SOCKET_EVENTS.GAME_STARTED, ({ gameState, players }) => {
      setGameState(gameState);
      setPlayers(players);

      // Set current player from currentPlayerIndex
      if (gameState.currentPlayerIndex >= 0 && gameState.currentPlayerIndex < players.length) {
        const currentPlayer = players[gameState.currentPlayerIndex];
        if (currentPlayer) {
          setCurrentPlayer(currentPlayer.id);
        }
      }

      // Extract my hand
      const me = players.find(p => p.id === myPlayerId);
      if (me && 'hand' in me) {
        setMyHand(me.hand as Card[]);
      }
    });

    // Game state update
    socket.on(SOCKET_EVENTS.GAME_STATE, ({ gameState, players }) => {
      setGameState(gameState);
      setPlayers(players);

      // Set current player from currentPlayerIndex
      if (gameState.currentPlayerIndex >= 0 && gameState.currentPlayerIndex < players.length) {
        const currentPlayer = players[gameState.currentPlayerIndex];
        if (currentPlayer) {
          setCurrentPlayer(currentPlayer.id);
        }
      }

      // Extract my hand
      const me = players.find(p => p.id === myPlayerId);
      if (me && 'hand' in me) {
        setMyHand(me.hand as Card[]);
      }
    });

    // Turn change
    socket.on(SOCKET_EVENTS.TURN_CHANGE, ({ currentPlayerId }) => {
      setCurrentPlayer(currentPlayerId);
    });

    // Cards played
    socket.on(SOCKET_EVENTS.CARDS_PLAYED, ({ playerId, cards }) => {
      console.log(`Player ${playerId} played:`, cards);
    });

    // Game end
    socket.on(SOCKET_EVENTS.GAME_END, ({ rankings }) => {
      console.log("Game ended! Rankings:", rankings);
    });

    // Error
    socket.on(SOCKET_EVENTS.ERROR, ({ message }) => {
      console.error("Game error:", message);
      alert(`Error: ${message}`);
    });

    return () => {
      socket.off(SOCKET_EVENTS.GAME_CREATED);
      socket.off(SOCKET_EVENTS.GAME_JOINED);
      socket.off(SOCKET_EVENTS.PLAYER_JOINED);
      socket.off(SOCKET_EVENTS.PLAYER_LEFT);
      socket.off(SOCKET_EVENTS.PLAYER_READY_UPDATE);
      socket.off(SOCKET_EVENTS.GAME_STARTED);
      socket.off(SOCKET_EVENTS.GAME_STATE);
      socket.off(SOCKET_EVENTS.TURN_CHANGE);
      socket.off(SOCKET_EVENTS.CARDS_PLAYED);
      socket.off(SOCKET_EVENTS.GAME_END);
      socket.off(SOCKET_EVENTS.ERROR);
    };
  }, [socket, myPlayerId]);

  // Game actions
  const createGame = (playerName: string, maxPlayers: number = 6) => {
    socket?.emit(SOCKET_EVENTS.CREATE_GAME, {
      playerName,
      gameConfig: { maxPlayers },
    });
  };

  const joinGame = (gameCode: string, playerName: string) => {
    socket?.emit(SOCKET_EVENTS.JOIN_GAME, { gameCode, playerName });
  };

  const toggleReady = () => {
    socket?.emit(SOCKET_EVENTS.PLAYER_READY);
  };

  const startGame = () => {
    socket?.emit(SOCKET_EVENTS.START_GAME);
  };

  const playCards = (cards: Card[]) => {
    socket?.emit(SOCKET_EVENTS.PLAY_CARDS, { cards });
  };

  const passTurn = () => {
    socket?.emit(SOCKET_EVENTS.PASS_TURN);
  };

  const leaveGame = () => {
    socket?.emit(SOCKET_EVENTS.LEAVE_GAME);
    // Clear localStorage
    localStorage.removeItem('gameCode');
    localStorage.removeItem('playerId');
  };

  // Get saved game info for reconnection
  const getSavedGameInfo = () => {
    if (typeof window === 'undefined') return null;
    const gameCode = localStorage.getItem('gameCode');
    const playerId = localStorage.getItem('playerId');
    return gameCode && playerId ? { gameCode, playerId } : null;
  };

  return {
    // State
    gameState,
    players,
    currentPlayerId,
    myPlayerId,
    myHand,
    isMyTurn: currentPlayerId === myPlayerId,
    me: players.find(p => p.id === myPlayerId),

    // Actions
    createGame,
    joinGame,
    toggleReady,
    startGame,
    playCards,
    passTurn,
    leaveGame,
    getSavedGameInfo,
  };
}
