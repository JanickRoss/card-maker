import { describe, it, expect } from 'vitest';
import { Card } from '@/lib/games/base/Card';
import { Rank, Suit } from '@/types/game';

describe('Card Class', () => {
  describe('constructor', () => {
    it('should create a card with correct properties', () => {
      const card = new Card(Suit.HEARTS, Rank.ACE);
      expect(card.suit).toBe(Suit.HEARTS);
      expect(card.rank).toBe(Rank.ACE);
      expect(card.id).toBe('hearts-A');
    });
  });

  describe('getValue', () => {
    it('should return 0 for THREE', () => {
      const card = new Card(Suit.HEARTS, Rank.THREE);
      expect(card.getValue()).toBe(0);
    });

    it('should return 12 for TWO (highest)', () => {
      const card = new Card(Suit.HEARTS, Rank.TWO);
      expect(card.getValue()).toBe(12);
    });

    it('should return correct values for face cards', () => {
      expect(new Card(Suit.HEARTS, Rank.JACK).getValue()).toBe(8);
      expect(new Card(Suit.HEARTS, Rank.QUEEN).getValue()).toBe(9);
      expect(new Card(Suit.HEARTS, Rank.KING).getValue()).toBe(10);
      expect(new Card(Suit.HEARTS, Rank.ACE).getValue()).toBe(11);
    });
  });

  describe('isHigherThan', () => {
    it('should return true when card is higher', () => {
      const card1 = new Card(Suit.HEARTS, Rank.SEVEN);
      const card2 = new Card(Suit.DIAMONDS, Rank.FIVE);
      expect(card1.isHigherThan(card2)).toBe(true);
    });

    it('should return false when card is lower', () => {
      const card1 = new Card(Suit.HEARTS, Rank.FIVE);
      const card2 = new Card(Suit.DIAMONDS, Rank.SEVEN);
      expect(card1.isHigherThan(card2)).toBe(false);
    });

    it('should return false when cards are equal', () => {
      const card1 = new Card(Suit.HEARTS, Rank.FIVE);
      const card2 = new Card(Suit.DIAMONDS, Rank.FIVE);
      expect(card1.isHigherThan(card2)).toBe(false);
    });

    it('should handle TWO as highest card', () => {
      const two = new Card(Suit.HEARTS, Rank.TWO);
      const ace = new Card(Suit.DIAMONDS, Rank.ACE);
      expect(two.isHigherThan(ace)).toBe(true);
    });
  });

  describe('hasSameRank', () => {
    it('should return true for cards with same rank', () => {
      const card1 = new Card(Suit.HEARTS, Rank.FIVE);
      const card2 = new Card(Suit.DIAMONDS, Rank.FIVE);
      expect(card1.hasSameRank(card2)).toBe(true);
    });

    it('should return false for cards with different ranks', () => {
      const card1 = new Card(Suit.HEARTS, Rank.FIVE);
      const card2 = new Card(Suit.DIAMONDS, Rank.SIX);
      expect(card1.hasSameRank(card2)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return correct string representation', () => {
      expect(new Card(Suit.HEARTS, Rank.ACE).toString()).toBe('A♥');
      expect(new Card(Suit.DIAMONDS, Rank.KING).toString()).toBe('K♦');
      expect(new Card(Suit.CLUBS, Rank.QUEEN).toString()).toBe('Q♣');
      expect(new Card(Suit.SPADES, Rank.JACK).toString()).toBe('J♠');
    });
  });
});
