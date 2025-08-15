'use client';

import { useEffect } from 'react';
import { useStore } from '@/lib/store';
import ChapterBar from '@/components/ChapterBar';
import QuestionViewer from '@/components/QuestionViewer';
import AnswerPanel from '@/components/AnswerPanel';

export default function ExamPage() {
  const {
    loadQuestions,
    currentQuestion,
    nextQuestion,
    sessionMode,
    setSessionMode,
    timer,
    initExamTimer,
  } = useStore();

  // On mount, load questions and set exam mode
  useEffect(() => {
    setSessionMode('exam');
    loadQuestions().catch((err) => console.error(err));
    initExamTimer(60 * 60); // default exam timer: 60 minutes
  }, [loadQuestions, setSessionMode, initExamTimer]);

  if (!currentQuestion) {
    return <div className="p-6">Caricamento domande…</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <ChapterBar />
        <div className="text-right">
          <div className="text-sm text-gray-500">Tempo restante</div>
          <div className="font-mono text-xl">{Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}</div>
        </div>
      </div>
      <QuestionViewer question={currentQuestion} />
      <AnswerPanel question={currentQuestion} onNext={nextQuestion} />
    </div>
  );
}