"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8 animate-[fadeIn_0.6s_ease-out]">🎴 Card Game Maker</h1>
        <p className="text-text-secondary mb-12 animate-[fadeIn_0.8s_ease-out]">
          Créez et jouez à des jeux de cartes multijoueurs en ligne
        </p>

        <div className="flex gap-4 justify-center animate-[fadeIn_1s_ease-out]">
          <button
            onClick={() => router.push("/create")}
            className="bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
          >
            Créer une partie
          </button>
          <button
            onClick={() => router.push("/join")}
            className="bg-surface hover:bg-surface/90 text-white font-semibold py-3 px-6 rounded-lg border border-primary/20 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Rejoindre une partie
          </button>
        </div>

        <div className="mt-16 text-text-muted animate-[fadeIn_1.2s_ease-out]">
          <p className="mb-2">Jeux disponibles:</p>
          <ul className="space-y-1">
            <li>• Trou de cul (Président)</li>
            <li className="opacity-50">• Texas Hold&apos;em (Bientôt)</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
