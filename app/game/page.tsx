"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/hooks/useGame";
import { PlayingCard } from "@/components/game/PlayingCard";
import { Card } from "@/types/game";

export default function GamePage() {
  const router = useRouter();
  const {
    gameState,
    players,
    currentPlayerId,
    myHand,
    isMyTurn,
    me,
    playCards,
    passTurn,
    leaveGame,
  } = useGame();

  const [selectedCards, setSelectedCards] = useState<Card[]>([]);

  useEffect(() => {
    // Redirect if game not started
    if (!gameState || gameState.status === "lobby") {
      router.push("/lobby");
    }

    // Redirect if game finished
    if (gameState?.status === "finished") {
      router.push("/results");
    }
  }, [gameState?.status, router]);

  const toggleCardSelection = (card: Card) => {
    setSelectedCards(prev => {
      const isSelected = prev.some(c => c.id === card.id);
      if (isSelected) {
        return prev.filter(c => c.id !== card.id);
      } else {
        // Only allow selecting cards of the same rank
        if (prev.length > 0 && prev[0].rank !== card.rank) {
          return [card];
        }
        return [...prev, card];
      }
    });
  };

  const handlePlayCards = () => {
    if (selectedCards.length === 0) return;
    playCards(selectedCards);
    setSelectedCards([]);
  };

  const handlePass = () => {
    passTurn();
    setSelectedCards([]);
  };

  const handleLeave = () => {
    if (confirm("Voulez-vous vraiment quitter la partie ?")) {
      leaveGame();
      router.push("/");
    }
  };

  const currentPlayer = players.find(p => p.id === currentPlayerId);
  const otherPlayers = players.filter(p => p.id !== me?.id);
  const lastPlayedCards = gameState?.playedCards || [];

  if (!gameState || !me) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-text-secondary">Chargement...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Trou de cul</h1>
            <p className="text-sm text-text-secondary">
              Partie: {gameState.code}
            </p>
          </div>
          <button
            onClick={handleLeave}
            className="px-4 py-2 bg-danger/20 hover:bg-danger/30 text-danger rounded-lg transition-colors"
          >
            Quitter
          </button>
        </div>

        {/* Other players */}
        <div className="mb-8">
          <div className="grid grid-cols-3 gap-4">
            {otherPlayers.map((player) => (
              <div
                key={player.id}
                className={`
                  bg-surface rounded-lg p-4
                  ${player.id === currentPlayerId ? "ring-2 ring-primary" : ""}
                `}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{player.name}</span>
                  {player.rank && player.rank !== "none" && (
                    <span className="text-xs bg-primary/20 px-2 py-1 rounded">
                      {player.rank === "president" && "👑 Président"}
                      {player.rank === "vice_president" && "🎩 Vice-P"}
                      {player.rank === "neutral" && "😐 Neutre"}
                      {player.rank === "vice_asshole" && "😕 Vice-T"}
                      {player.rank === "asshole" && "💩 Trou de cul"}
                    </span>
                  )}
                </div>
                <p className="text-sm text-text-secondary">
                  {player.cardCount} carte{player.cardCount > 1 ? "s" : ""}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Center - Last played cards */}
        <div className="bg-surface/50 rounded-lg p-8 mb-8 min-h-[200px] flex flex-col items-center justify-center">
          <p className="text-sm text-text-secondary mb-4">
            {currentPlayer?.id === me.id
              ? "C'est votre tour !"
              : `Tour de ${currentPlayer?.name}`}
          </p>

          {lastPlayedCards.length > 0 && (
            <div>
              <p className="text-xs text-text-muted mb-2 text-center">
                Dernières cartes jouées:
              </p>
              <div className="flex gap-2 justify-center">
                {lastPlayedCards.map((card) => (
                  <PlayingCard key={card.id} card={card} size="md" />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* My hand */}
        <div className="bg-surface rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              Votre main ({myHand.length} cartes)
            </h2>
            {me.rank && me.rank !== "none" && (
              <span className="bg-primary/20 px-3 py-1 rounded">
                {me.rank === "president" && "👑 Président"}
                {me.rank === "vice_president" && "🎩 Vice-Président"}
                {me.rank === "neutral" && "😐 Neutre"}
                {me.rank === "vice_asshole" && "😕 Vice-Trou de cul"}
                {me.rank === "asshole" && "💩 Trou de cul"}
              </span>
            )}
          </div>

          {/* Cards */}
          <div className="flex gap-2 flex-wrap mb-4 justify-center">
            {myHand.map((card) => (
              <PlayingCard
                key={card.id}
                card={card}
                selected={selectedCards.some(c => c.id === card.id)}
                onClick={() => isMyTurn && toggleCardSelection(card)}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={handlePass}
              disabled={!isMyTurn}
              className="px-6 py-3 bg-surface hover:bg-background border border-primary/20 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Passer
            </button>
            <button
              onClick={handlePlayCards}
              disabled={!isMyTurn || selectedCards.length === 0}
              className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Jouer {selectedCards.length > 0 && `(${selectedCards.length})`}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
