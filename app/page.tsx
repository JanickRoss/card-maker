"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">🎴 Card Game Maker</h1>
        <p className="text-text-secondary mb-12">
          Créez et jouez à des jeux de cartes multijoueurs en ligne
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => router.push("/create")}
            className="bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Créer une partie
          </button>
          <button
            onClick={() => router.push("/join")}
            className="bg-surface hover:bg-surface/90 text-white font-semibold py-3 px-6 rounded-lg border border-primary/20 transition-colors"
          >
            Rejoindre une partie
          </button>
        </div>

        <div className="mt-16 text-text-muted">
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
