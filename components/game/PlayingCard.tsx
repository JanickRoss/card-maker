import { Card, Suit } from "@/types/game";

interface PlayingCardProps {
  card: Card;
  selected?: boolean;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
  animate?: boolean;
}

export function PlayingCard({
  card,
  selected = false,
  onClick,
  size = "md",
  animate = false
}: PlayingCardProps) {
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
        transition-all duration-300 ease-in-out
        ${onClick ? "cursor-pointer hover:scale-110 hover:shadow-xl hover:-translate-y-1" : "cursor-default"}
        ${selected ? "ring-4 ring-primary -translate-y-3 scale-105 shadow-2xl" : ""}
        ${!onClick ? "opacity-90" : "hover:brightness-105"}
        ${animate ? "animate-[dealCard_0.3s_ease-out]" : ""}
      `}
    >
      <span className={`font-bold ${suitColors[card.suit]} transition-colors`}>
        {card.rank}
      </span>
      <span className={`text-2xl ${suitColors[card.suit]} transition-all`}>
        {suitSymbols[card.suit]}
      </span>
      <span className={`font-bold ${suitColors[card.suit]} transition-colors`}>
        {card.rank}
      </span>
    </button>
  );
}
