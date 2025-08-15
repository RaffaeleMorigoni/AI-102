export type QuestionType = 'single' | 'multiple' | 'dragdrop' | 'ordering' | 'matching' | 'unknown';

export interface Question {
  id: string;
  chapterId: string;
  type: QuestionType;
  image: string;
  answers?: string[];
  correct?: string[];
  explanation?: string;
  dragTargets?: { id: string; label: string }[];
  dragSources?: { id: string; label: string }[];
}

export interface Chapter {
  id: string;
  name: string;
  progress: number;
}