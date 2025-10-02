import { Game } from "../base/Game";
import { Player } from "../base/Player";
import { Card } from "../base/Card";
import { GameConfig, GameStatus, GameType } from "@/types/game";
import { PlayerRank } from "@/types/player";
import {
  isValidCardSet,
  beatsLastPlay,
  findThreeOfClubsPlayer,
  mustPlayThreeOfClubs,
  determineRanks
} from "./rules";
import { isPlayerTurn, playerHasCards } from "./validators";

export class PresidentGame extends Game {
  private passedPlayers: Set<string> = new Set();
  private finishOrder: string[] = [];
  private isFirstTurn: boolean = true;

  constructor(id: string, code: string, maxPlayers: number = 6) {
    const config: GameConfig = {
      type: GameType.PRESIDENT,
      maxPlayers,
      minPlayers: 3,
      name: "Trou de cul",
    };
    super(id, code, config);
  }

  /**
   * Start the game
   */
  start(): void {
    if (!this.canStart()) {
      throw new Error("Cannot start game - not enough players or not all ready");
    }

    // Shuffle and deal cards
    this.deck.shuffle();
    const players = this.getPlayers();
    const cardsPerPlayer = Math.floor(52 / players.length);

    players.forEach(player => {
      const cards = this.deck.deal(cardsPerPlayer);
      player.addCards(cards);
    });

    // Find player with 3 of clubs to start
    const startPlayerIndex = findThreeOfClubsPlayer(players);
    if (startPlayerIndex !== -1) {
      this.state.currentPlayerIndex = startPlayerIndex;
    }

    this.state.status = GameStatus.IN_PROGRESS;
    this.isFirstTurn = true;
  }

  /**
   * Play cards
   */
  playCards(playerId: string, cards: Card[]): void {
    const player = this.getPlayer(playerId);
    const currentPlayer = this.getCurrentPlayer();

    if (!player) {
      throw new Error("Player not found");
    }

    if (!isPlayerTurn(playerId, currentPlayer)) {
      throw new Error("Not your turn");
    }

    if (!playerHasCards(player, cards)) {
      throw new Error("You don't have these cards");
    }

    if (!this.isValidPlay(playerId, cards)) {
      throw new Error("Invalid play");
    }

    // Remove cards from player's hand
    player.removeCards(cards);

    // Add to played cards
    this.state.playedCards = cards;

    // Reset passed players
    this.passedPlayers.clear();

    // Check if player finished
    if (player.hasEmptyHand()) {
      this.finishOrder.push(playerId);

      // Check if game is over
      if (this.finishOrder.length === this.getPlayers().length - 1) {
        this.endGame();
        return;
      }
    }

    // Move to next player
    this.nextTurn();
    this.isFirstTurn = false;
  }

  /**
   * Pass turn
   */
  passTurn(playerId: string): void {
    const currentPlayer = this.getCurrentPlayer();

    if (!isPlayerTurn(playerId, currentPlayer)) {
      throw new Error("Not your turn");
    }

    // Can't pass on first turn if you have 3 of clubs
    if (this.isFirstTurn) {
      const player = this.getPlayer(playerId);
      if (player && findThreeOfClubsPlayer([player]) !== -1) {
        throw new Error("Cannot pass - you must play the 3 of clubs");
      }
    }

    this.passedPlayers.add(playerId);

    // If all players except one have passed, clear the board
    const activePlayers = this.getPlayers().filter(p => !p.hasEmptyHand()).length;
    if (this.passedPlayers.size >= activePlayers - 1) {
      this.state.playedCards = [];
      this.passedPlayers.clear();
    }

    this.nextTurn();
  }

  /**
   * Check if play is valid
   */
  isValidPlay(playerId: string, cards: Card[]): boolean {
    if (!isValidCardSet(cards)) {
      return false;
    }

    // First turn must include 3 of clubs
    if (this.isFirstTurn && !mustPlayThreeOfClubs(cards, true)) {
      return false;
    }

    // Must beat last play
    if (!beatsLastPlay(cards, this.state.playedCards)) {
      return false;
    }

    return true;
  }

  /**
   * Move to next player's turn
   */
  private nextTurn(): void {
    const players = this.getPlayers();
    let nextIndex = (this.state.currentPlayerIndex + 1) % players.length;

    // Skip players who have finished
    while (players[nextIndex].hasEmptyHand()) {
      nextIndex = (nextIndex + 1) % players.length;
    }

    this.state.currentPlayerIndex = nextIndex;
  }

  /**
   * End the game and assign ranks
   */
  private endGame(): void {
    // Add the last player to finish order
    const lastPlayer = this.getPlayers().find(p => !this.finishOrder.includes(p.id));
    if (lastPlayer) {
      this.finishOrder.push(lastPlayer.id);
    }

    // Assign ranks
    const ranks = determineRanks(this.finishOrder, this.getPlayers().length);

    ranks.forEach((rank, playerId) => {
      const player = this.getPlayer(playerId);
      if (player) {
        player.setRank(rank as PlayerRank);
      }
    });

    this.state.status = GameStatus.FINISHED;
  }

  /**
   * Get current game info for client
   */
  getGameInfo() {
    return {
      state: this.getState(),
      players: this.getPlayers().map(p => p.toPublicData()),
      currentPlayer: this.getCurrentPlayer()?.id,
      finishOrder: this.finishOrder,
      isFirstTurn: this.isFirstTurn,
    };
  }

  /**
   * Get player's private info (including their hand)
   */
  getPlayerInfo(playerId: string) {
    const player = this.getPlayer(playerId);
    if (!player) return null;

    return {
      id: player.id,
      name: player.name,
      hand: player.hand,
      isReady: player.isReady,
      isHost: player.isHost,
      rank: player.rank,
      position: player.position,
    };
  }
}
