'use client';

import Link from 'next/link';
import GamificationHUD from '@/components/GamificationHUD';

export default function HomePage() {
  return (
    <main className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-4xl font-bold mt-4">Microsoft Exam Trainer</h1>
      <p className="text-gray-700">Preparati per gli esami Microsoft con un approccio gamificato simile a Duolingo. Carica le tue domande, esercitati con sessioni rapide o affronta l’esame completo e tieni traccia dei tuoi progressi.</p>
      <GamificationHUD />
      <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
        <Link href="/practice" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-center">Inizia pratica</Link>
        <Link href="/exam" className="bg-green-600 text-white px-4 py-2 rounded-lg text-center">Simula esame</Link>
        <Link href="/import" className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-center">Importa domande</Link>
      </div>
    </main>
  );
}