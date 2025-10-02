import { PresidentGame } from "../games/president/PresidentGame";
import { Player } from "../games/base/Player";
import { generateGameCode, generatePlayerId, generateGameId } from "@/utils/gameHelpers";

/**
 * Manages all active games in memory
 */
export class GameManager {
  private games: Map<string, PresidentGame> = new Map();
  private playerToGame: Map<string, string> = new Map(); // playerId -> gameCode

  /**
   * Create a new game
   */
  createGame(playerName: string, maxPlayers: number = 6): { game: PresidentGame; player: Player; code: string } {
    const gameId = generateGameId();
    const gameCode = this.generateUniqueGameCode();
    const playerId = generatePlayerId();

    const game = new PresidentGame(gameId, gameCode, maxPlayers);
    const player = new Player(playerId, playerName, 0, true); // Host

    player.setReady(true); // Host is automatically ready
    game.addPlayer(player);

    this.games.set(gameCode, game);
    this.playerToGame.set(playerId, gameCode);

    return { game, player, code: gameCode };
  }

  /**
   * Join an existing game
   */
  joinGame(gameCode: string, playerName: string): { game: PresidentGame; player: Player } {
    const game = this.games.get(gameCode);

    if (!game) {
      throw new Error("Game not found");
    }

    const playerId = generatePlayerId();
    const position = game.getPlayers().length;
    const player = new Player(playerId, playerName, position);

    game.addPlayer(player);
    this.playerToGame.set(playerId, gameCode);

    return { game, player };
  }

  /**
   * Get a game by code
   */
  getGame(gameCode: string): PresidentGame | undefined {
    return this.games.get(gameCode);
  }

  /**
   * Get game by player ID
   */
  getGameByPlayer(playerId: string): PresidentGame | undefined {
    const gameCode = this.playerToGame.get(playerId);
    if (!gameCode) return undefined;
    return this.games.get(gameCode);
  }

  /**
   * Remove a player from their game
   */
  removePlayer(playerId: string): { game?: PresidentGame; gameCode?: string } {
    const gameCode = this.playerToGame.get(playerId);
    if (!gameCode) return {};

    const game = this.games.get(gameCode);
    if (!game) return {};

    game.removePlayer(playerId);
    this.playerToGame.delete(playerId);

    // If no players left, delete the game
    if (game.getPlayers().length === 0) {
      this.games.delete(gameCode);
    }

    return { game, gameCode };
  }

  /**
   * Generate a unique game code
   */
  private generateUniqueGameCode(): string {
    let code: string;
    do {
      code = generateGameCode();
    } while (this.games.has(code));
    return code;
  }

  /**
   * Get all active games count
   */
  getActiveGamesCount(): number {
    return this.games.size;
  }

  /**
   * Clean up finished games (optional - for production)
   */
  cleanupFinishedGames(): void {
    const now = Date.now();
    const ONE_HOUR = 60 * 60 * 1000;

    this.games.forEach((game, code) => {
      if (game.getStatus() === "finished") {
        // Remove games finished more than 1 hour ago
        // This would need a timestamp tracking mechanism
        this.games.delete(code);
      }
    });
  }
}

// Singleton instance
export const gameManager = new GameManager();
