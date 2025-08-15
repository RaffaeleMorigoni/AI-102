'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';

export default function ImportPage() {
  const [status, setStatus] = useState<string>('');
  const { importFromFile } = useStore();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    setStatus('Import in corso…');
    try {
      await importFromFile(file);
      setStatus('Import completato!');
    } catch (err) {
      console.error(err);
      setStatus('Errore durante l’importazione');
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Importa domande</h1>
      <p className="text-gray-700">Carica un file ZIP contenente screenshot e metadati organizzati per capitolo. Il sistema genererà automaticamente un report di importazione. Le domande verranno visualizzate solo come immagini finché non validerai i metadati.</p>
      <input type="file" accept=".zip" onChange={handleFile} className="border p-2 rounded" />
      {status && <div className="text-sm text-gray-600">{status}</div>}
    </div>
  );
}