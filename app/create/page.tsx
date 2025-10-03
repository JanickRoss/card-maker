"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/hooks/useGame";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function CreatePage() {
  const router = useRouter();
  const { createGame, gameState } = useGame();
  const [playerName, setPlayerName] = useState("");
  const [maxPlayers, setMaxPlayers] = useState(6);
  const [isCreating, setIsCreating] = useState(false);

  // Navigate to lobby when game is created
  useEffect(() => {
    if (isCreating && gameState?.code) {
      router.push("/lobby");
    }
  }, [gameState?.code, isCreating, router]);

  const handleCreate = () => {
    if (!playerName.trim()) {
      alert("Veuillez entrer votre nom");
      return;
    }

    setIsCreating(true);
    createGame(playerName, maxPlayers);
  };

  if (isCreating) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Création de la partie..." />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface rounded-lg p-8 shadow-xl animate-[fadeIn_0.5s_ease-out]">
        <h1 className="text-3xl font-bold mb-6 animate-[slideIn_0.6s_ease-out]">Créer une Partie</h1>

        <div className="space-y-6">
          <div className="animate-[slideIn_0.7s_ease-out]">
            <label htmlFor="playerName" className="block text-sm font-medium mb-2">
              Votre nom
            </label>
            <input
              id="playerName"
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Entrez votre nom"
              className="w-full px-4 py-2 bg-background border border-primary/20 rounded-lg focus:outline-none focus:border-primary transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              maxLength={20}
              disabled={isCreating}
            />
          </div>

          <div className="animate-[slideIn_0.8s_ease-out]">
            <label htmlFor="maxPlayers" className="block text-sm font-medium mb-2">
              Nombre maximum de joueurs
            </label>
            <select
              id="maxPlayers"
              value={maxPlayers}
              onChange={(e) => setMaxPlayers(Number(e.target.value))}
              className="w-full px-4 py-2 bg-background border border-primary/20 rounded-lg focus:outline-none focus:border-primary transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              disabled={isCreating}
            >
              <option value={3}>3 joueurs</option>
              <option value={4}>4 joueurs</option>
              <option value={5}>5 joueurs</option>
              <option value={6}>6 joueurs</option>
              <option value={7}>7 joueurs</option>
              <option value={8}>8 joueurs</option>
            </select>
          </div>

          <div className="pt-4 animate-[slideIn_0.9s_ease-out]">
            <button
              onClick={handleCreate}
              disabled={isCreating}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
            >
              {isCreating ? "Création..." : "Créer la partie"}
            </button>
          </div>

          <div className="text-center animate-[fadeIn_1s_ease-out]">
            <button
              onClick={() => router.push("/")}
              className="text-text-secondary hover:text-primary transition-colors"
            >
              ← Retour
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
