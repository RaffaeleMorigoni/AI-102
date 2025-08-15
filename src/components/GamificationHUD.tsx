'use client';

import { useStore } from '@/lib/store';

export default function GamificationHUD() {
  const { xp, hearts, streak, correctCount, totalAnswered } = useStore();
  const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
      <div className="flex items-center gap-2">
        <span className="font-medium">XP:</span> {xp}
      </div>
      <div className="flex items-center gap-2">
        <span className="font-medium">Cuori:</span> {hearts}
      </div>
      <div className="flex items-center gap-2">
        <span className="font-medium">Streak:</span> {streak}
      </div>
      <div className="flex items-center gap-2">
        <span className="font-medium">Accuratezza:</span> {accuracy}%
      </div>
    </div>
  );
}