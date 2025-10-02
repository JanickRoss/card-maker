"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/hooks/useGame";

export default function JoinPage() {
  const router = useRouter();
  const { joinGame } = useGame();
  const [playerName, setPlayerName] = useState("");
  const [gameCode, setGameCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  const handleJoin = async () => {
    if (!playerName.trim()) {
      alert("Veuillez entrer votre nom");
      return;
    }

    if (!gameCode.trim()) {
      alert("Veuillez entrer le code de la partie");
      return;
    }

    setIsJoining(true);

    try {
      await joinGame(gameCode.toUpperCase(), playerName);
      router.push("/lobby");
    } catch (error) {
      console.error("Failed to join game:", error);
      setIsJoining(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface rounded-lg p-8 shadow-xl">
        <h1 className="text-3xl font-bold mb-6">Rejoindre une Partie</h1>

        <div className="space-y-6">
          <div>
            <label htmlFor="gameCode" className="block text-sm font-medium mb-2">
              Code de la partie
            </label>
            <input
              id="gameCode"
              type="text"
              value={gameCode}
              onChange={(e) => setGameCode(e.target.value.toUpperCase())}
              placeholder="ABC123"
              className="w-full px-4 py-2 bg-background border border-primary/20 rounded-lg focus:outline-none focus:border-primary text-center text-2xl font-mono tracking-wider"
              maxLength={6}
              disabled={isJoining}
            />
          </div>

          <div>
            <label htmlFor="playerName" className="block text-sm font-medium mb-2">
              Votre nom
            </label>
            <input
              id="playerName"
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Entrez votre nom"
              className="w-full px-4 py-2 bg-background border border-primary/20 rounded-lg focus:outline-none focus:border-primary"
              maxLength={20}
              disabled={isJoining}
            />
          </div>

          <div className="pt-4">
            <button
              onClick={handleJoin}
              disabled={isJoining}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isJoining ? "Connexion..." : "Rejoindre"}
            </button>
          </div>

          <div className="text-center">
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
