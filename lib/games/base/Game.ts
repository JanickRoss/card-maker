import { GameState, GameStatus, GameConfig } from "@/types/game";
import { Player } from "./Player";
import { Deck } from "./Deck";
import { Card } from "./Card";

export abstract class Game {
  protected state: GameState;
  protected players: Map<string, Player>;
  protected deck: Deck;

  constructor(id: string, code: string, config: GameConfig) {
    this.state = {
      id,
      code,
      status: GameStatus.LOBBY,
      config,
      currentPlayerIndex: 0,
      deck: [],
      playedCards: [],
    };
    this.players = new Map();
    this.deck = new Deck();
  }

  /**
   * Add a player to the game
   */
  addPlayer(player: Player): void {
    if (this.players.size >= this.state.config.maxPlayers) {
      throw new Error("Game is full");
    }
    if (this.state.status !== GameStatus.LOBBY) {
      throw new Error("Cannot join game in progress");
    }
    this.players.set(player.id, player);
  }

  /**
   * Remove a player from the game
   */
  removePlayer(playerId: string): Player | undefined {
    const player = this.players.get(playerId);
    this.players.delete(playerId);
    return player;
  }

  /**
   * Get a player by ID
   */
  getPlayer(playerId: string): Player | undefined {
    return this.players.get(playerId);
  }

  /**
   * Get all players
   */
  getPlayers(): Player[] {
    return Array.from(this.players.values());
  }

  /**
   * Get current player
   */
  getCurrentPlayer(): Player | undefined {
    const players = this.getPlayers();
    return players[this.state.currentPlayerIndex];
  }

  /**
   * Check if all players are ready
   */
  allPlayersReady(): boolean {
    const players = this.getPlayers();
    return players.length >= this.state.config.minPlayers &&
           players.every(p => p.isReady);
  }

  /**
   * Check if game can start
   */
  canStart(): boolean {
    return this.allPlayersReady() && this.state.status === GameStatus.LOBBY;
  }

  /**
   * Get game state
   */
  getState(): GameState {
    return { ...this.state };
  }

  /**
   * Get game code
   */
  getCode(): string {
    return this.state.code;
  }

  /**
   * Get game status
   */
  getStatus(): GameStatus {
    return this.state.status;
  }

  /**
   * Set game status
   */
  protected setStatus(status: GameStatus): void {
    this.state.status = status;
  }

  // Abstract methods to be implemented by specific games
  abstract start(): void;
  abstract playCards(playerId: string, cards: Card[]): void;
  abstract passTurn(playerId: string): void;
  abstract isValidPlay(playerId: string, cards: Card[]): boolean;
}
