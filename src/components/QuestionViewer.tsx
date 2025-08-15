'use client';

import Image from 'next/image';
import { Question } from '@/lib/types';

interface QuestionViewerProps {
  question: Question;
}

export default function QuestionViewer({ question }: QuestionViewerProps) {
  return (
    <div className="w-full bg-white rounded shadow overflow-hidden">
      {question.image ? (
        <Image
          src={question.image}
          alt={`Domanda ${question.id}`}
          width={800}
          height={600}
          className="w-full h-auto object-contain"
          priority
        />
      ) : (
        <div className="p-4 text-center text-gray-500">Immagine non disponibile</div>
      )}
    </div>
  );
}