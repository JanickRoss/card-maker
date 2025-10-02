import { Player as PlayerType, PlayerRank } from "@/types/player";
import { Card } from "./Card";

export class Player implements PlayerType {
  id: string;
  name: string;
  hand: Card[];
  isReady: boolean;
  isHost: boolean;
  rank: PlayerRank;
  position: number;

  constructor(id: string, name: string, position: number, isHost = false) {
    this.id = id;
    this.name = name;
    this.hand = [];
    this.isReady = false;
    this.isHost = isHost;
    this.rank = PlayerRank.NONE;
    this.position = position;
  }

  /**
   * Add cards to player's hand
   */
  addCards(cards: Card[]): void {
    this.hand.push(...cards);
    this.sortHand();
  }

  /**
   * Remove specific cards from hand
   */
  removeCards(cards: Card[]): Card[] {
    const removedCards: Card[] = [];
    for (const card of cards) {
      const index = this.hand.findIndex(
        (c) => c.suit === card.suit && c.rank === card.rank
      );
      if (index !== -1) {
        removedCards.push(...this.hand.splice(index, 1));
      }
    }
    return removedCards;
  }

  /**
   * Sort hand by card value
   */
  sortHand(): void {
    this.hand.sort((a, b) => a.getValue() - b.getValue());
  }

  /**
   * Check if player has specific cards
   */
  hasCards(cards: Card[]): boolean {
    for (const card of cards) {
      const hasCard = this.hand.some(
        (c) => c.suit === card.suit && c.rank === card.rank
      );
      if (!hasCard) return false;
    }
    return true;
  }

  /**
   * Get number of cards in hand
   */
  getCardCount(): number {
    return this.hand.length;
  }

  /**
   * Check if hand is empty
   */
  hasEmptyHand(): boolean {
    return this.hand.length === 0;
  }

  /**
   * Set player ready status
   */
  setReady(ready: boolean): void {
    this.isReady = ready;
  }

  /**
   * Set player rank
   */
  setRank(rank: PlayerRank): void {
    this.rank = rank;
  }

  /**
   * Clear player's hand
   */
  clearHand(): void {
    this.hand = [];
  }

  /**
   * Get serializable player data (without sensitive info)
   */
  toPublicData(): Omit<PlayerType, "hand"> & { cardCount: number } {
    return {
      id: this.id,
      name: this.name,
      isReady: this.isReady,
      isHost: this.isHost,
      rank: this.rank,
      position: this.position,
      cardCount: this.hand.length,
    };
  }
}
