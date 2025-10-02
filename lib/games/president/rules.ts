import { Card } from "../base/Card";
import { Rank, Suit } from "@/types/game";

/**
 * Validate if cards played are valid for President game
 */
export function isValidCardSet(cards: Card[]): boolean {
  if (cards.length === 0) return false;

  // All cards must have the same rank
  const firstRank = cards[0].rank;
  return cards.every(card => card.rank === firstRank);
}

/**
 * Check if played cards beat the previous play
 */
export function beatsLastPlay(newCards: Card[], lastCards: Card[]): boolean {
  // If no last cards, any valid play works
  if (lastCards.length === 0) return true;

  // Must play same number of cards
  if (newCards.length !== lastCards.length) return false;

  // Must be same rank among new cards
  if (!isValidCardSet(newCards)) return false;

  // New cards must be higher value
  return newCards[0].getValue() > lastCards[0].getValue();
}

/**
 * Find player who has the 3 of clubs (first player for first round)
 */
export function findThreeOfClubsPlayer(players: { hand: Card[] }[]): number {
  return players.findIndex(player =>
    player.hand.some(card =>
      card.rank === Rank.THREE && card.suit === Suit.CLUBS
    )
  );
}

/**
 * Check if player must play the 3 of clubs (first turn of game)
 */
export function mustPlayThreeOfClubs(cards: Card[], isFirstTurn: boolean): boolean {
  if (!isFirstTurn) return true;

  // On first turn, must include 3 of clubs if playing
  return cards.some(card =>
    card.rank === Rank.THREE && card.suit === Suit.CLUBS
  );
}

/**
 * Determine player ranks based on finish order
 */
export function determineRanks(finishOrder: string[], totalPlayers: number): Map<string, string> {
  const ranks = new Map<string, string>();

  finishOrder.forEach((playerId, index) => {
    if (index === 0) {
      ranks.set(playerId, "president");
    } else if (index === 1) {
      ranks.set(playerId, "vice_president");
    } else if (index === totalPlayers - 1) {
      ranks.set(playerId, "asshole");
    } else if (index === totalPlayers - 2) {
      ranks.set(playerId, "vice_asshole");
    } else {
      ranks.set(playerId, "neutral");
    }
  });

  return ranks;
}

/**
 * Get cards that can be played based on last play
 */
export function getPlayableCards(hand: Card[], lastPlay: Card[]): Card[][] {
  const playable: Card[][] = [];

  if (lastPlay.length === 0) {
    // Can play any valid set
    const grouped = groupCardsByRank(hand);
    grouped.forEach(cards => {
      for (let i = 1; i <= cards.length; i++) {
        playable.push(cards.slice(0, i));
      }
    });
  } else {
    // Must beat last play
    const requiredCount = lastPlay.length;
    const minValue = lastPlay[0].getValue();

    const grouped = groupCardsByRank(hand);
    grouped.forEach(cards => {
      if (cards.length >= requiredCount && cards[0].getValue() > minValue) {
        playable.push(cards.slice(0, requiredCount));
      }
    });
  }

  return playable;
}

/**
 * Group cards by rank
 */
function groupCardsByRank(cards: Card[]): Card[][] {
  const groups = new Map<string, Card[]>();

  cards.forEach(card => {
    const rank = card.rank;
    if (!groups.has(rank)) {
      groups.set(rank, []);
    }
    groups.get(rank)!.push(card);
  });

  return Array.from(groups.values());
}
