export enum Suit {
  HEARTS = "hearts",
  DIAMONDS = "diamonds",
  CLUBS = "clubs",
  SPADES = "spades",
}

export enum Rank {
  THREE = "3",
  FOUR = "4",
  FIVE = "5",
  SIX = "6",
  SEVEN = "7",
  EIGHT = "8",
  NINE = "9",
  TEN = "10",
  JACK = "J",
  QUEEN = "Q",
  KING = "K",
  ACE = "A",
  TWO = "2",
}

export interface Card {
  suit: Suit;
  rank: Rank;
  id: string;
}

export enum GameType {
  PRESIDENT = "president",
  TEXAS_HOLDEM = "texas_holdem",
}

export enum GameStatus {
  LOBBY = "lobby",
  IN_PROGRESS = "in_progress",
  FINISHED = "finished",
  ABANDONED = "abandoned",
}

export interface GameConfig {
  type: GameType;
  maxPlayers: number;
  minPlayers: number;
  name: string;
}

export interface GameState {
  id: string;
  code: string;
  status: GameStatus;
  config: GameConfig;
  currentPlayerIndex: number;
  deck: Card[];
  playedCards: Card[];
}
