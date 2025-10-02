import { describe, it, expect } from 'vitest';
import { Card } from '@/lib/games/base/Card';
import { Rank, Suit } from '@/types/game';
import {
  isValidCardSet,
  beatsLastPlay,
  getCardValue,
  mustPlayThreeOfClubs,
  findThreeOfClubsPlayer,
  determineRanks,
} from '@/lib/games/president/rules';

describe('President Game Rules', () => {
  describe('getCardValue', () => {
    it('should return correct values for all ranks', () => {
      expect(getCardValue({ rank: Rank.THREE })).toBe(0);
      expect(getCardValue({ rank: Rank.FOUR })).toBe(1);
      expect(getCardValue({ rank: Rank.ACE })).toBe(11);
      expect(getCardValue({ rank: Rank.TWO })).toBe(12); // Highest
    });
  });

  describe('isValidCardSet', () => {
    it('should return false for empty array', () => {
      expect(isValidCardSet([])).toBe(false);
    });

    it('should return true for cards of same rank', () => {
      const cards = [
        new Card(Suit.HEARTS, Rank.FIVE),
        new Card(Suit.DIAMONDS, Rank.FIVE),
      ];
      expect(isValidCardSet(cards)).toBe(true);
    });

    it('should return false for cards of different ranks', () => {
      const cards = [
        new Card(Suit.HEARTS, Rank.FIVE),
        new Card(Suit.DIAMONDS, Rank.SIX),
      ];
      expect(isValidCardSet(cards)).toBe(false);
    });

    it('should return true for single card', () => {
      const cards = [new Card(Suit.HEARTS, Rank.KING)];
      expect(isValidCardSet(cards)).toBe(true);
    });
  });

  describe('beatsLastPlay', () => {
    it('should return true when no previous play', () => {
      const newCards = [new Card(Suit.HEARTS, Rank.FIVE)];
      expect(beatsLastPlay(newCards, [])).toBe(true);
    });

    it('should return false when different number of cards', () => {
      const lastCards = [new Card(Suit.HEARTS, Rank.FIVE)];
      const newCards = [
        new Card(Suit.DIAMONDS, Rank.SIX),
        new Card(Suit.CLUBS, Rank.SIX),
      ];
      expect(beatsLastPlay(newCards, lastCards)).toBe(false);
    });

    it('should return true when higher rank with same count', () => {
      const lastCards = [new Card(Suit.HEARTS, Rank.FIVE)];
      const newCards = [new Card(Suit.DIAMONDS, Rank.SEVEN)];
      expect(beatsLastPlay(newCards, lastCards)).toBe(true);
    });

    it('should return false when lower rank', () => {
      const lastCards = [new Card(Suit.HEARTS, Rank.SEVEN)];
      const newCards = [new Card(Suit.DIAMONDS, Rank.FIVE)];
      expect(beatsLastPlay(newCards, lastCards)).toBe(false);
    });

    it('should handle pairs correctly', () => {
      const lastCards = [
        new Card(Suit.HEARTS, Rank.FIVE),
        new Card(Suit.DIAMONDS, Rank.FIVE),
      ];
      const newCards = [
        new Card(Suit.CLUBS, Rank.EIGHT),
        new Card(Suit.SPADES, Rank.EIGHT),
      ];
      expect(beatsLastPlay(newCards, lastCards)).toBe(true);
    });

    it('should recognize 2 as highest card', () => {
      const lastCards = [new Card(Suit.HEARTS, Rank.ACE)];
      const newCards = [new Card(Suit.DIAMONDS, Rank.TWO)];
      expect(beatsLastPlay(newCards, lastCards)).toBe(true);
    });
  });

  describe('mustPlayThreeOfClubs', () => {
    it('should return true if cards contain 3 of clubs on first turn', () => {
      const cards = [
        new Card(Suit.CLUBS, Rank.THREE),
        new Card(Suit.HEARTS, Rank.THREE),
      ];
      expect(mustPlayThreeOfClubs(cards, true)).toBe(true);
    });

    it('should return false if cards dont contain 3 of clubs on first turn', () => {
      const cards = [new Card(Suit.HEARTS, Rank.FIVE)];
      expect(mustPlayThreeOfClubs(cards, false)).toBe(true);
    });

    it('should always return true if not first turn', () => {
      const cards = [new Card(Suit.HEARTS, Rank.KING)];
      expect(mustPlayThreeOfClubs(cards, false)).toBe(true);
    });
  });

  describe('findThreeOfClubsPlayer', () => {
    it('should find player with 3 of clubs', () => {
      const players = [
        { hand: [new Card(Suit.HEARTS, Rank.FIVE)] },
        { hand: [new Card(Suit.CLUBS, Rank.THREE)] },
        { hand: [new Card(Suit.DIAMONDS, Rank.KING)] },
      ];
      expect(findThreeOfClubsPlayer(players)).toBe(1);
    });

    it('should return -1 if no player has 3 of clubs', () => {
      const players = [
        { hand: [new Card(Suit.HEARTS, Rank.FIVE)] },
        { hand: [new Card(Suit.DIAMONDS, Rank.SIX)] },
      ];
      expect(findThreeOfClubsPlayer(players)).toBe(-1);
    });
  });

  describe('determineRanks', () => {
    it('should assign correct ranks for 4 players', () => {
      const finishOrder = ['player1', 'player2', 'player3', 'player4'];
      const ranks = determineRanks(finishOrder, 4);

      expect(ranks.get('player1')).toBe('president');
      expect(ranks.get('player2')).toBe('vice_president');
      expect(ranks.get('player3')).toBe('vice_asshole');
      expect(ranks.get('player4')).toBe('asshole');
    });

    it('should assign correct ranks for 3 players', () => {
      const finishOrder = ['player1', 'player2', 'player3'];
      const ranks = determineRanks(finishOrder, 3);

      expect(ranks.get('player1')).toBe('president');
      expect(ranks.get('player2')).toBe('vice_president');
      expect(ranks.get('player3')).toBe('asshole');
    });

    it('should assign neutral ranks for middle players', () => {
      const finishOrder = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'];
      const ranks = determineRanks(finishOrder, 6);

      expect(ranks.get('p1')).toBe('president');
      expect(ranks.get('p2')).toBe('vice_president');
      expect(ranks.get('p3')).toBe('neutral');
      expect(ranks.get('p4')).toBe('neutral');
      expect(ranks.get('p5')).toBe('vice_asshole');
      expect(ranks.get('p6')).toBe('asshole');
    });
  });
});
