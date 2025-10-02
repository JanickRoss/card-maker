import { create } from "zustand";
import { GameState, Card } from "@/types/game";
import { Player } from "@/types/player";

interface GameStore {
  // Game state
  gameState: GameState | null;
  players: (Omit<Player, "hand"> & { cardCount: number; hand?: Card[] })[];
  currentPlayerId: string | null;
  myPlayerId: string | null;
  myHand: Card[];

  // Actions
  setGameState: (state: GameState) => void;
  setPlayers: (players: (Omit<Player, "hand"> & { cardCount: number; hand?: Card[] })[]) => void;
  setCurrentPlayer: (playerId: string) => void;
  setMyPlayerId: (playerId: string) => void;
  setMyHand: (hand: Card[]) => void;
  updatePlayerReady: (playerId: string, isReady: boolean) => void;
  addPlayer: (player: Omit<Player, "hand"> & { cardCount: number }) => void;
  removePlayer: (playerId: string) => void;
  reset: () => void;
}

const initialState = {
  gameState: null,
  players: [],
  currentPlayerId: null,
  myPlayerId: null,
  myHand: [],
};

export const useGameStore = create<GameStore>((set) => ({
  ...initialState,

  setGameState: (state) => set({ gameState: state }),

  setPlayers: (players) => set({ players }),

  setCurrentPlayer: (playerId) => set({ currentPlayerId: playerId }),

  setMyPlayerId: (playerId) => set({ myPlayerId: playerId }),

  setMyHand: (hand) => set({ myHand: hand }),

  updatePlayerReady: (playerId, isReady) =>
    set((state) => ({
      players: state.players.map((p) =>
        p.id === playerId ? { ...p, isReady } : p
      ),
    })),

  addPlayer: (player) =>
    set((state) => ({
      players: [...state.players, player],
    })),

  removePlayer: (playerId) =>
    set((state) => ({
      players: state.players.filter((p) => p.id !== playerId),
    })),

  reset: () => set(initialState),
}));
