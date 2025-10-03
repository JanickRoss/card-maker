"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/hooks/useGame";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/ui/Toast";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function LobbyPage() {
  const router = useRouter();
  const {
    gameState,
    players,
    me,
    toggleReady,
    startGame,
    leaveGame,
  } = useGame();

  const [copied, setCopied] = useState(false);
  const [previousPlayerCount, setPreviousPlayerCount] = useState(0);
  const { toasts, success, info } = useToast();

  useEffect(() => {
    // Redirect to game when started
    if (gameState?.status === "in_progress") {
      router.push("/game");
    }
  }, [gameState?.status, router]);

  // Toast notifications for player join/leave
  useEffect(() => {
    if (previousPlayerCount === 0) {
      setPreviousPlayerCount(players.length);
      return;
    }

    if (players.length > previousPlayerCount) {
      const newPlayer = players[players.length - 1];
      if (newPlayer.id !== me?.id) {
        info(`${newPlayer.name} a rejoint la partie`, 2000);
      }
    } else if (players.length < previousPlayerCount) {
      info("Un joueur a quitté la partie", 2000);
    }

    setPreviousPlayerCount(players.length);
  }, [players, previousPlayerCount, me, info]);

  const handleCopyCode = () => {
    if (gameState?.code) {
      navigator.clipboard.writeText(gameState.code);
      setCopied(true);
      success("Code copié !", 1500);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLeave = () => {
    leaveGame();
    router.push("/");
  };

  const canStart = me?.isHost && players.every(p => p.isReady) && players.length >= 3;

  if (!gameState) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Chargement du salon..." />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-surface rounded-lg p-8 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Salon d&apos;attente</h1>
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-2 bg-background px-4 py-2 rounded-lg border border-primary/20 hover:border-primary transition-colors"
          >
            <span className="font-mono text-2xl">{gameState.code}</span>
            <span className="text-sm text-text-secondary">
              {copied ? "✓ Copié" : "Copier"}
            </span>
          </button>
        </div>

        {/* Players list */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Joueurs ({players.length}/{gameState.config.maxPlayers})
          </h2>
          <div className="space-y-2">
            {players.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between bg-background p-4 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    player.isReady ? "bg-accent" : "bg-text-muted"
                  }`} />
                  <span className="font-medium">{player.name}</span>
                  {player.isHost && (
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                      Hôte
                    </span>
                  )}
                  {player.id === me?.id && (
                    <span className="text-xs bg-secondary/20 text-secondary px-2 py-1 rounded">
                      Vous
                    </span>
                  )}
                </div>
                <span className={`text-sm ${
                  player.isReady ? "text-accent" : "text-text-muted"
                }`}>
                  {player.isReady ? "Prêt" : "Pas prêt"}
                </span>
              </div>
            ))}
          </div>

          {players.length < gameState.config.minPlayers && (
            <p className="mt-4 text-center text-warning text-sm">
              ⚠️ Minimum {gameState.config.minPlayers} joueurs requis
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={handleLeave}
            className="flex-1 bg-danger/20 hover:bg-danger/30 text-danger font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Quitter
          </button>

          {me?.isHost ? (
            <button
              onClick={startGame}
              disabled={!canStart}
              className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {!canStart
                ? players.length < 3
                  ? `Besoin de ${3 - players.length} joueur(s)`
                  : "Attendre que tous soient prêts"
                : "Démarrer la partie"}
            </button>
          ) : (
            <button
              onClick={toggleReady}
              className={`flex-1 font-semibold py-3 px-6 rounded-lg transition-colors ${
                me?.isReady
                  ? "bg-accent/20 hover:bg-accent/30 text-accent"
                  : "bg-primary hover:bg-primary/90 text-white"
              }`}
            >
              {me?.isReady ? "Annuler" : "Je suis prêt"}
            </button>
          )}
        </div>
      </div>

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} />
    </main>
  );
}
