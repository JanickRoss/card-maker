/**
 * Game constants
 */

export const GAME_CODE_LENGTH = 6;
export const GAME_CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Excluding similar chars

export const PRESIDENT_CONFIG = {
  MIN_PLAYERS: 3,
  MAX_PLAYERS: 10,
  RECOMMENDED_MIN: 4,
  RECOMMENDED_MAX: 8,
};

export const POKER_CONFIG = {
  MIN_PLAYERS: 2,
  MAX_PLAYERS: 9,
  SMALL_BLIND: 10,
  BIG_BLIND: 20,
  DEFAULT_STACK: 1000,
};

/**
 * WebSocket events
 */
export const SOCKET_EVENTS = {
  // Client to Server
  CREATE_GAME: "create-game",
  JOIN_GAME: "join-game",
  LEAVE_GAME: "leave-game",
  PLAYER_READY: "player-ready",
  START_GAME: "start-game",
  PLAY_CARDS: "play-cards",
  PASS_TURN: "pass-turn",

  // Server to Client
  GAME_CREATED: "game-created",
  GAME_JOINED: "game-joined",
  PLAYER_JOINED: "player-joined",
  PLAYER_LEFT: "player-left",
  PLAYER_READY_UPDATE: "player-ready-update",
  GAME_STARTED: "game-started",
  GAME_STATE: "game-state",
  TURN_CHANGE: "turn-change",
  CARDS_PLAYED: "cards-played",
  ROUND_END: "round-end",
  GAME_END: "game-end",
  ERROR: "error",
} as const;

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  GAME_NOT_FOUND: "Game not found",
  GAME_FULL: "Game is full",
  GAME_ALREADY_STARTED: "Game already started",
  INVALID_PLAYER: "Invalid player",
  NOT_YOUR_TURN: "Not your turn",
  INVALID_PLAY: "Invalid play",
  INSUFFICIENT_PLAYERS: "Not enough players to start",
  PLAYERS_NOT_READY: "All players must be ready",
} as const;
