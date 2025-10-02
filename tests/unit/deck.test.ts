import { describe, it, expect, beforeEach } from 'vitest';
import { Deck } from '@/lib/games/base/Deck';
import { Rank, Suit } from '@/types/game';

describe('Deck Class', () => {
  let deck: Deck;

  beforeEach(() => {
    deck = new Deck();
  });

  describe('constructor', () => {
    it('should create a full deck of 52 cards', () => {
      expect(deck.getRemainingCount()).toBe(52);
    });

    it('should contain all suits', () => {
      const cards = deck.getCards();
      const suits = new Set(cards.map(c => c.suit));
      expect(suits.size).toBe(4);
      expect(suits.has(Suit.HEARTS)).toBe(true);
      expect(suits.has(Suit.DIAMONDS)).toBe(true);
      expect(suits.has(Suit.CLUBS)).toBe(true);
      expect(suits.has(Suit.SPADES)).toBe(true);
    });

    it('should contain all ranks', () => {
      const cards = deck.getCards();
      const ranks = new Set(cards.map(c => c.rank));
      expect(ranks.size).toBe(13);
    });

    it('should have exactly 4 of each rank', () => {
      const cards = deck.getCards();
      const rankCounts = new Map<string, number>();

      cards.forEach(card => {
        const count = rankCounts.get(card.rank) || 0;
        rankCounts.set(card.rank, count + 1);
      });

      rankCounts.forEach(count => {
        expect(count).toBe(4);
      });
    });
  });

  describe('shuffle', () => {
    it('should maintain deck size after shuffle', () => {
      deck.shuffle();
      expect(deck.getRemainingCount()).toBe(52);
    });

    it('should randomize card order', () => {
      const originalOrder = deck.getCards().map(c => c.id);
      deck.shuffle();
      const shuffledOrder = deck.getCards().map(c => c.id);

      // Very unlikely to be the same order after shuffle
      expect(originalOrder).not.toEqual(shuffledOrder);
    });
  });

  describe('deal', () => {
    it('should deal requested number of cards', () => {
      const cards = deck.deal(5);
      expect(cards.length).toBe(5);
    });

    it('should reduce remaining count after dealing', () => {
      deck.deal(5);
      expect(deck.getRemainingCount()).toBe(47);
    });

    it('should return empty array when deck is empty', () => {
      deck.deal(52);
      const cards = deck.deal(1);
      expect(cards.length).toBe(0);
    });

    it('should not deal more cards than available', () => {
      const cards = deck.deal(60);
      expect(cards.length).toBe(52);
      expect(deck.getRemainingCount()).toBe(0);
    });

    it('should deal unique cards', () => {
      const cards = deck.deal(52);
      const ids = new Set(cards.map(c => c.id));
      expect(ids.size).toBe(52);
    });
  });

  describe('reset', () => {
    it('should restore full deck after dealing', () => {
      deck.deal(20);
      deck.reset();
      expect(deck.getRemainingCount()).toBe(52);
    });

    it('should restore original order after reset', () => {
      const originalOrder = deck.getCards().map(c => c.id);
      deck.shuffle();
      deck.deal(10);
      deck.reset();
      const resetOrder = deck.getCards().map(c => c.id);
      expect(resetOrder).toEqual(originalOrder);
    });
  });

  describe('isEmpty', () => {
    it('should return false for new deck', () => {
      expect(deck.isEmpty()).toBe(false);
    });

    it('should return true when all cards dealt', () => {
      deck.deal(52);
      expect(deck.isEmpty()).toBe(true);
    });

    it('should return false after partial deal', () => {
      deck.deal(20);
      expect(deck.isEmpty()).toBe(false);
    });
  });
});
