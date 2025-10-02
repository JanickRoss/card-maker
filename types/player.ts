import { Card } from "./game";

export enum PlayerRank {
  PRESIDENT = "president",
  VICE_PRESIDENT = "vice_president",
  NEUTRAL = "neutral",
  VICE_ASSHOLE = "vice_asshole",
  ASSHOLE = "asshole",
  NONE = "none",
}

export interface Player {
  id: string;
  name: string;
  hand: Card[];
  isReady: boolean;
  isHost: boolean;
  rank: PlayerRank;
  position: number;
}

export interface PlayerConnection {
  playerId: string;
  socketId: string;
  gameCode: string;
  connectedAt: number;
}
