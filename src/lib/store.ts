import create from 'zustand';
import { persist } from 'zustand/middleware';
import JSZip from 'jszip';
import { Question, Chapter } from './types';

type SessionMode = 'practice' | 'exam' | null;

interface StoreState {
  // Data
  chapters: Chapter[];
  currentChapterId: string | null;
  questions: Question[];
  currentQuestionIndex: number;
  // Gamification
  hearts: number;
  xp: number;
  streak: number;
  correctCount: number;
  totalAnswered: number;
  accuracy?: number;
  // Session and timers
  sessionMode: SessionMode;
  timer: number;
  timerInterval: any;
  // Actions
  loadQuestions: () => Promise<void>;
  setSessionMode: (mode: SessionMode) => void;
  answerQuestion: (question: Question, selected: string[]) => void;
  nextQuestion: () => void;
  initExamTimer: (seconds: number) => void;
  importFromFile: (file: File) => Promise<void>;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      chapters: [],
      currentChapterId: null,
      questions: [],
      currentQuestionIndex: 0,
      hearts: 5,
      xp: 0,
      streak: 0,
      correctCount: 0,
      totalAnswered: 0,
      sessionMode: null,
      timer: 0,
      timerInterval: null,

      /**
       * Load questions from the public folder.
       * This method tries to fetch the import_report.json file that lists questions
       * and chapters. If the file is missing, no questions will be loaded until
       * the user imports a ZIP file.
       */
      async loadQuestions() {
        try {
          const res = await fetch('/questions/import_report.json');
          if (!res.ok) {
            console.warn('import_report.json non trovato');
            return;
          }
          const report = await res.json();
          // Expect report to be { chapters: { id, name }, questions: { id, chapterId, type, image, answers, correct, explanation } }
          const chapters: Chapter[] = report.chapters || [];
          const questions: Question[] = report.questions || [];
          set({
            chapters,
            questions,
            currentChapterId: chapters.length > 0 ? chapters[0].id : null,
            currentQuestionIndex: 0,
          });
        } catch (err) {
          console.error(err);
        }
      },

      setSessionMode(mode) {
        set({ sessionMode: mode, currentQuestionIndex: 0, hearts: 5, xp: 0, correctCount: 0, totalAnswered: 0 });
      },

      answerQuestion(question, selected) {
        const correctAnswers = question.correct || [];
        const isCorrect =
          selected.length === correctAnswers.length &&
          selected.every((ans) => correctAnswers.includes(ans));
        let { hearts, xp, correctCount, totalAnswered } = get();
        totalAnswered += 1;
        if (isCorrect) {
          correctCount += 1;
          // Award XP based on type
          xp += question.type === 'multiple' ? 15 : 10;
        } else {
          // Deduct a heart if wrong
          hearts = Math.max(0, hearts - 1);
        }
        // Update accuracy
        const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;
        set({ hearts, xp, correctCount, totalAnswered, accuracy });
      },

      nextQuestion() {
        const { currentQuestionIndex, questions, chapters } = get();
        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex < questions.length) {
          // Advance question index
          // Determine new chapter if necessary
          const newChapterId = questions[nextIndex].chapterId;
          set({ currentQuestionIndex: nextIndex, currentChapterId: newChapterId });
        } else {
          // If no more questions, reset or end session
          console.info('No more questions in current session');
        }
      },

      initExamTimer(seconds: number) {
        // Clear previous timer if exists
        const { timerInterval } = get();
        if (timerInterval) {
          clearInterval(timerInterval);
        }
        set({ timer: seconds });
        const intervalId = setInterval(() => {
          set((state) => {
            if (state.timer <= 0) {
              clearInterval(intervalId);
              return { timer: 0 };
            }
            return { timer: state.timer - 1 };
          });
        }, 1000);
        set({ timerInterval: intervalId });
      },

      async importFromFile(file: File) {
        const zip = await JSZip.loadAsync(file);
        const chaptersMap = new Map<string, Chapter>();
        const questions: Question[] = [];
        const fileNames = Object.keys(zip.files);
        await Promise.all(
          fileNames.map(async (path) => {
            const entry = zip.file(path);
            if (!entry || entry.dir) return;
            const lower = path.toLowerCase();
            if (lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.jpeg')) {
              const parts = path.split('/');
              // derive chapter from parent folder if exists
              const chapterId = parts.length > 1 ? parts[parts.length - 2] : 'default';
              const filename = parts[parts.length - 1];
              const id = filename.substring(0, filename.lastIndexOf('.'));
              // Try to read metadata
              const metaPath = path.replace(/\.(png|jpg|jpeg)$/i, '.json');
              let meta: any = {};
              if (zip.files[metaPath]) {
                const jsonStr = await zip.files[metaPath].async('text');
                try {
                  meta = JSON.parse(jsonStr);
                } catch (err) {
                  console.warn(`Errore parsing JSON per ${metaPath}:`, err);
                }
              }
              const base64 = await entry.async('base64');
              const mime = lower.endsWith('.png') ? 'image/png' : 'image/jpeg';
              const image = `data:${mime};base64,${base64}`;
              const q: Question = {
                id,
                chapterId,
                type: (meta.type || 'unknown') as any,
                image,
                answers: meta.answers,
                correct: meta.correct,
                explanation: meta.explanation,
                dragTargets: meta.dragTargets,
                dragSources: meta.dragSources,
              };
              questions.push(q);
              if (!chaptersMap.has(chapterId)) {
                chaptersMap.set(chapterId, { id: chapterId, name: chapterId, progress: 0 });
              }
            }
          })
        );
        // update state
        set({
          chapters: Array.from(chaptersMap.values()),
          currentChapterId: Array.from(chaptersMap.keys())[0] || null,
          questions,
          currentQuestionIndex: 0,
        });
      },
    }),
    {
      name: 'exam-trainer-storage',
      partialize: (state) => ({
        hearts: state.hearts,
        xp: state.xp,
        streak: state.streak,
        correctCount: state.correctCount,
        totalAnswered: state.totalAnswered,
      }),
    }
  )
);