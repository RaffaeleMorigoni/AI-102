'use client';

import { useStore } from '@/lib/store';
import { useMemo } from 'react';

export default function ReviewPage() {
  const { questions, correctCount, totalAnswered } = useStore();
  // For simplicity, we treat questions without metadata or answers as skipped
  const incorrectlyAnswered = useMemo(() => {
    // In a full implementation, we would track per-question correctness. Here we just show all questions.
    return questions;
  }, [questions]);
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Revisione domande</h1>
      <p className="text-gray-700">Numero totale domande: {questions.length}. Risposte corrette: {correctCount} su {totalAnswered}.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {incorrectlyAnswered.map((q) => (
          <div key={q.id} className="border rounded p-2">
            <p className="font-medium">{q.id} ({q.chapterId})</p>
            <img src={q.image} alt={q.id} className="mt-1 w-full h-32 object-cover rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}