import { Card, Suit } from "@/types/game";

interface PlayingCardProps {
  card: Card;
  selected?: boolean;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
}

export function PlayingCard({ card, selected = false, onClick, size = "md" }: PlayingCardProps) {
  const suitSymbols = {
    [Suit.HEARTS]: "♥",
    [Suit.DIAMONDS]: "♦",
    [Suit.CLUBS]: "♣",
    [Suit.SPADES]: "♠",
  };

  const suitColors = {
    [Suit.HEARTS]: "text-card-red",
    [Suit.DIAMONDS]: "text-card-red",
    [Suit.CLUBS]: "text-gray-900",
    [Suit.SPADES]: "text-gray-900",
  };

  const sizes = {
    sm: "w-12 h-16 text-sm",
    md: "w-16 h-24 text-base",
    lg: "w-20 h-28 text-lg",
  };

  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={`
        ${sizes[size]}
        bg-white rounded-lg shadow-lg
        flex flex-col items-center justify-between
        p-2
        transition-all
        ${onClick ? "cursor-pointer hover:scale-105" : "cursor-default"}
        ${selected ? "ring-4 ring-primary -translate-y-2" : ""}
        ${!onClick ? "opacity-90" : ""}
      `}
    >
      <span className={`font-bold ${suitColors[card.suit]}`}>
        {card.rank}
      </span>
      <span className={`text-2xl ${suitColors[card.suit]}`}>
        {suitSymbols[card.suit]}
      </span>
      <span className={`font-bold ${suitColors[card.suit]}`}>
        {card.rank}
      </span>
    </button>
  );
}
