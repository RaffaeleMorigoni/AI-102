'use client';

import { useEffect } from 'react';
import { useStore } from '@/lib/store';
import ChapterBar from '@/components/ChapterBar';
import QuestionViewer from '@/components/QuestionViewer';
import AnswerPanel from '@/components/AnswerPanel';

export default function PracticePage() {
  const {
    loadQuestions,
    currentQuestion,
    nextQuestion,
    sessionMode,
    setSessionMode,
  } = useStore();

  // On mount, load questions and set practice mode
  useEffect(() => {
    setSessionMode('practice');
    loadQuestions().catch((err) => console.error(err));
  }, [loadQuestions, setSessionMode]);

  if (!currentQuestion) {
    return <div className="p-6">Caricamento domande…</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <ChapterBar />
      <QuestionViewer question={currentQuestion} />
      <AnswerPanel question={currentQuestion} onNext={nextQuestion} />
    </div>
  );
}