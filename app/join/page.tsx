"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/hooks/useGame";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function JoinPage() {
  const router = useRouter();
  const { joinGame, gameState } = useGame();
  const [playerName, setPlayerName] = useState("");
  const [gameCode, setGameCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  // Navigate to lobby when successfully joined
  useEffect(() => {
    if (isJoining && gameState?.code) {
      router.push("/lobby");
    }
  }, [gameState?.code, isJoining, router]);

  const handleJoin = () => {
    if (!playerName.trim()) {
      alert("Veuillez entrer votre nom");
      return;
    }

    if (!gameCode.trim()) {
      alert("Veuillez entrer le code de la partie");
      return;
    }

    setIsJoining(true);
    joinGame(gameCode.toUpperCase(), playerName);
  };

  if (isJoining) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Connexion à la partie..." />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface rounded-lg p-8 shadow-xl animate-[fadeIn_0.5s_ease-out]">
        <h1 className="text-3xl font-bold mb-6 animate-[slideIn_0.6s_ease-out]">Rejoindre une Partie</h1>

        <div className="space-y-6">
          <div className="animate-[slideIn_0.7s_ease-out]">
            <label htmlFor="gameCode" className="block text-sm font-medium mb-2">
              Code de la partie
            </label>
            <input
              id="gameCode"
              type="text"
              value={gameCode}
              onChange={(e) => setGameCode(e.target.value.toUpperCase())}
              placeholder="ABC123"
              className="w-full px-4 py-2 bg-background border border-primary/20 rounded-lg focus:outline-none focus:border-primary text-center text-2xl font-mono tracking-wider transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              maxLength={6}
              disabled={isJoining}
            />
          </div>

          <div className="animate-[slideIn_0.8s_ease-out]">
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
              disabled={isJoining}
            />
          </div>

          <div className="pt-4 animate-[slideIn_0.9s_ease-out]">
            <button
              onClick={handleJoin}
              disabled={isJoining}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
            >
              {isJoining ? "Connexion..." : "Rejoindre"}
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
