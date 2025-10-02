import { Card as CardType, Suit, Rank } from "@/types/game";

export class Card implements CardType {
  suit: Suit;
  rank: Rank;
  id: string;

  constructor(suit: Suit, rank: Rank) {
    this.suit = suit;
    this.rank = rank;
    this.id = `${suit}-${rank}`;
  }

  /**
   * Get numeric value for card comparison
   * 3 = 0, 4 = 1, ..., A = 11, 2 = 12 (highest)
   */
  getValue(): number {
    const rankOrder = [
      Rank.THREE,
      Rank.FOUR,
      Rank.FIVE,
      Rank.SIX,
      Rank.SEVEN,
      Rank.EIGHT,
      Rank.NINE,
      Rank.TEN,
      Rank.JACK,
      Rank.QUEEN,
      Rank.KING,
      Rank.ACE,
      Rank.TWO,
    ];
    return rankOrder.indexOf(this.rank);
  }

  /**
   * Check if this card is higher than another card
   */
  isHigherThan(other: Card): boolean {
    return this.getValue() > other.getValue();
  }

  /**
   * Check if this card has the same rank as another
   */
  hasSameRank(other: Card): boolean {
    return this.rank === other.rank;
  }

  /**
   * Get display string for card
   */
  toString(): string {
    const suitSymbols = {
      [Suit.HEARTS]: "♥",
      [Suit.DIAMONDS]: "♦",
      [Suit.CLUBS]: "♣",
      [Suit.SPADES]: "♠",
    };
    return `${this.rank}${suitSymbols[this.suit]}`;
  }
}
