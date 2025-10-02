import { Card } from "./game";
import { Player } from "./player";
import { GameState } from "./game";

// Public player data (without hand)
export type PublicPlayer = Omit<Player, "hand"> & { cardCount: number; hand?: Card[] };

// Client to Server events
export interface ClientToServerEvents {
  "create-game": (data: { playerName: string; gameConfig: any }) => void;
  "join-game": (data: { gameCode: string; playerName: string }) => void;
  "leave-game": () => void;
  "player-ready": () => void;
  "start-game": () => void;
  "play-cards": (data: { cards: Card[] }) => void;
  "pass-turn": () => void;
}

// Server to Client events
export interface ServerToClientEvents {
  "game-created": (data: { gameCode: string; playerId: string }) => void;
  "game-joined": (data: { playerId: string; gameState: GameState; players: PublicPlayer[] }) => void;
  "player-joined": (data: { player: PublicPlayer }) => void;
  "player-left": (data: { playerId: string }) => void;
  "player-ready-update": (data: { playerId: string; isReady: boolean }) => void;
  "game-started": (data: { gameState: GameState; players: PublicPlayer[] }) => void;
  "game-state": (data: { gameState: GameState; players: PublicPlayer[] }) => void;
  "turn-change": (data: { currentPlayerId: string }) => void;
  "cards-played": (data: { playerId: string; cards: Card[] }) => void;
  "round-end": (data: { winnerId: string }) => void;
  "game-end": (data: { rankings: { playerId: string; rank: string }[] }) => void;
  "error": (data: { message: string }) => void;
}

// Inter-server events
export interface InterServerEvents {
  ping: () => void;
}

// Socket data
export interface SocketData {
  playerId?: string;
  gameCode?: string;
}
