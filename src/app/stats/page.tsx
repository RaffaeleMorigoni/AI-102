'use client';

import { useStore } from '@/lib/store';

export default function StatsPage() {
  const { xp, hearts, streak, correctCount, totalAnswered } = useStore();
  const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Statistiche</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded shadow p-4">
          <h2 className="font-medium">Esperienza (XP)</h2>
          <p>{xp}</p>
        </div>
        <div className="bg-white rounded shadow p-4">
          <h2 className="font-medium">Cuori rimasti</h2>
          <p>{hearts}</p>
        </div>
        <div className="bg-white rounded shadow p-4">
          <h2 className="font-medium">Streak</h2>
          <p>{streak}</p>
        </div>
        <div className="bg-white rounded shadow p-4">
          <h2 className="font-medium">Accuratezza</h2>
          <p>{accuracy}%</p>
        </div>
      </div>
    </div>
  );
}