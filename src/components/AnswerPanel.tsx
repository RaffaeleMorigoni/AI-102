'use client';

import { useState } from 'react';
import { Question } from '@/lib/types';
import { useStore } from '@/lib/store';

interface AnswerPanelProps {
  question: Question;
  onNext: () => void;
}

export default function AnswerPanel({ question, onNext }: AnswerPanelProps) {
  const { answerQuestion } = useStore();
  const [selected, setSelected] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const isMultiple = question.type === 'multiple';

  const toggleChoice = (answer: string) => {
    if (!isMultiple) {
      setSelected([answer]);
    } else {
      setSelected((prev) => {
        if (prev.includes(answer)) {
          return prev.filter((a) => a !== answer);
        }
        return [...prev, answer];
      });
    }
  };

  const handleSubmit = () => {
    if (submitted) return;
    answerQuestion(question, selected);
    setSubmitted(true);
  };

  return (
    <div className="space-y-4">
      {question.answers && question.answers.length > 0 ? (
        <div className="space-y-2">
          {question.answers.map((ans) => {
            const isChecked = selected.includes(ans);
            return (
              <button
                key={ans}
                className={`w-full text-left px-4 py-2 rounded border ${isChecked ? 'bg-green-100 border-green-500' : 'bg-white border-gray-300 hover:bg-gray-100'}`}
                onClick={() => toggleChoice(ans)}
                disabled={submitted}
              >
                {ans}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="text-gray-500">Nessun metadato disponibile. La domanda può essere utilizzata solo in modalità review.</div>
      )}
      <div className="flex space-x-4">
        {!submitted && (
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded"
            disabled={selected.length === 0}
          >
            Verifica
          </button>
        )}
        {submitted && (
          <button
            onClick={onNext}
            className="bg-primary text-white px-4 py-2 rounded"
          >
            Prossima domanda
          </button>
        )}
      </div>
      {submitted && question.correct && (
        <div className="mt-2 p-2 rounded bg-gray-100">
          {selected.sort().join(',') === question.correct.sort().join(',') ? (
            <span className="text-green-700 font-medium">Corretto!</span>
          ) : (
            <span className="text-red-700 font-medium">Risposta errata. Risposta corretta: {question.correct.join(', ')}</span>
          )}
          {question.explanation && (
            <p className="text-sm mt-1 text-gray-700">{question.explanation}</p>
          )}
        </div>
      )}
    </div>
  );
}