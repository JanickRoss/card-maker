"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/hooks/useGame";
import { PlayingCard } from "@/components/game/PlayingCard";
import { Card } from "@/types/game";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/ui/Toast";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

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
  const [previousTurn, setPreviousTurn] = useState<string | null>(null);
  const { toasts, success, info, warning } = useToast();

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

  // Toast notifications for turn changes
  useEffect(() => {
    if (!currentPlayerId || !me) return;

    if (previousTurn !== null && previousTurn !== currentPlayerId) {
      const currentPlayer = players.find(p => p.id === currentPlayerId);
      if (currentPlayerId === me.id) {
        info("🎯 C'est votre tour !", 2000);
      } else if (currentPlayer) {
        info(`Tour de ${currentPlayer.name}`, 2000);
      }
    }

    setPreviousTurn(currentPlayerId);
  }, [currentPlayerId, me, players, previousTurn, info]);

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
    success(`${selectedCards.length} carte${selectedCards.length > 1 ? 's' : ''} jouée${selectedCards.length > 1 ? 's' : ''} !`);
    setSelectedCards([]);
  };

  const handlePass = () => {
    passTurn();
    warning("Vous passez votre tour");
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
        <LoadingSpinner size="lg" text="Chargement de la partie..." />
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
            {otherPlayers.map((player, index) => (
              <div
                key={player.id}
                className={`
                  bg-surface rounded-lg p-4 transition-all duration-300
                  ${player.id === currentPlayerId ? "ring-2 ring-primary animate-[pulse-ring_1s_ease-in-out_infinite]" : ""}
                  animate-[slideIn_0.3s_ease-out] opacity-0
                `}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'forwards'
                }}
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
        <div className="bg-surface/50 rounded-lg p-8 mb-8 min-h-[200px] flex flex-col items-center justify-center transition-all duration-500">
          <p className={`text-sm mb-4 transition-all duration-300 ${
            currentPlayer?.id === me.id
              ? "text-accent font-bold text-lg animate-[pulse-ring_1.5s_ease-in-out_infinite]"
              : "text-text-secondary"
          }`}>
            {currentPlayer?.id === me.id
              ? "🎯 C'est votre tour !"
              : `Tour de ${currentPlayer?.name}`}
          </p>

          {lastPlayedCards.length > 0 && (
            <div className="animate-[fadeIn_0.4s_ease-out]">
              <p className="text-xs text-text-muted mb-2 text-center">
                Dernières cartes jouées:
              </p>
              <div className="flex gap-2 justify-center">
                {lastPlayedCards.map((card, index) => (
                  <div
                    key={card.id}
                    className="animate-[dealCard_0.3s_ease-out]"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <PlayingCard card={card} size="md" />
                  </div>
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
            {myHand.map((card, index) => (
              <div
                key={card.id}
                className="animate-[dealCard_0.4s_ease-out]"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <PlayingCard
                  card={card}
                  selected={selectedCards.some(c => c.id === card.id)}
                  onClick={() => isMyTurn && toggleCardSelection(card)}
                  animate={true}
                />
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={handlePass}
              disabled={!isMyTurn}
              className="px-6 py-3 bg-surface hover:bg-background border border-primary/20 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
            >
              Passer
            </button>
            <button
              onClick={handlePlayCards}
              disabled={!isMyTurn || selectedCards.length === 0}
              className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
            >
              Jouer {selectedCards.length > 0 && `(${selectedCards.length})`}
            </button>
          </div>
        </div>
      </div>

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} />
    </main>
  );
}
