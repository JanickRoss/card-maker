import { Card } from "../base/Card";
import { Player } from "../base/Player";

/**
 * Validate if it's the player's turn
 */
export function isPlayerTurn(playerId: string, currentPlayer: Player | undefined): boolean {
  return currentPlayer?.id === playerId;
}

/**
 * Validate if player has the cards they're trying to play
 */
export function playerHasCards(player: Player, cards: Card[]): boolean {
  return player.hasCards(cards);
}

/**
 * Validate minimum players to start game
 */
export function hasMinimumPlayers(playerCount: number, minPlayers: number): boolean {
  return playerCount >= minPlayers;
}

/**
 * Validate all players are ready
 */
export function allPlayersReady(players: Player[]): boolean {
  return players.length > 0 && players.every(p => p.isReady);
}

/**
 * Validate game can start
 */
export function canStartGame(players: Player[], minPlayers: number): boolean {
  return hasMinimumPlayers(players.length, minPlayers) && allPlayersReady(players);
}
