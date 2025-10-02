"use client";

import { useRouter } from "next/navigation";
import { useGame } from "@/hooks/useGame";

export default function ResultsPage() {
  const router = useRouter();
  const { players, leaveGame } = useGame();

  const handleNewGame = () => {
    leaveGame();
    router.push("/");
  };

  const rankedPlayers = [...players].sort((a, b) => {
    const rankOrder = {
      president: 0,
      vice_president: 1,
      neutral: 2,
      vice_asshole: 3,
      asshole: 4,
      none: 5,
    };
    return rankOrder[a.rank] - rankOrder[b.rank];
  });

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-surface rounded-lg p-8 shadow-xl">
        <h1 className="text-4xl font-bold mb-8 text-center">🎉 Partie terminée !</h1>

        <div className="space-y-4 mb-8">
          {rankedPlayers.map((player, index) => (
            <div
              key={player.id}
              className={`
                flex items-center justify-between p-4 rounded-lg
                ${index === 0 ? "bg-primary/20 ring-2 ring-primary" : "bg-background"}
              `}
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold">#{index + 1}</span>
                <div>
                  <p className="font-semibold text-lg">{player.name}</p>
                  <p className="text-sm text-text-secondary">
                    {player.rank === "president" && "👑 Président"}
                    {player.rank === "vice_president" && "🎩 Vice-Président"}
                    {player.rank === "neutral" && "😐 Neutre"}
                    {player.rank === "vice_asshole" && "😕 Vice-Trou de cul"}
                    {player.rank === "asshole" && "💩 Trou de cul"}
                  </p>
                </div>
              </div>
              {index === 0 && (
                <span className="text-3xl">🏆</span>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleNewGame}
            className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Nouvelle partie
          </button>
        </div>
      </div>
    </main>
  );
}
