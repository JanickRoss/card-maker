import { Card } from "./Card";
import { Suit, Rank } from "@/types/game";

export class Deck {
  private cards: Card[] = [];

  constructor() {
    this.initialize();
  }

  /**
   * Create a standard 52-card deck
   */
  private initialize(): void {
    this.cards = [];
    const suits = Object.values(Suit);
    const ranks = Object.values(Rank);

    for (const suit of suits) {
      for (const rank of ranks) {
        this.cards.push(new Card(suit, rank));
      }
    }
  }

  /**
   * Shuffle the deck using Fisher-Yates algorithm
   */
  shuffle(): void {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  /**
   * Deal a specified number of cards
   */
  deal(count: number): Card[] {
    return this.cards.splice(0, count);
  }

  /**
   * Get remaining cards count
   */
  getRemainingCount(): number {
    return this.cards.length;
  }

  /**
   * Get all remaining cards
   */
  getCards(): Card[] {
    return [...this.cards];
  }

  /**
   * Reset the deck to full 52 cards
   */
  reset(): void {
    this.initialize();
  }

  /**
   * Check if deck is empty
   */
  isEmpty(): boolean {
    return this.cards.length === 0;
  }
}
