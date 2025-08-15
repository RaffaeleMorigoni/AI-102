'use client';

import { useStore } from '@/lib/store';

export default function ChapterBar() {
  const { chapters, currentChapterId } = useStore();

  return (
    <nav className="flex overflow-x-auto space-x-2 pb-2" aria-label="Chapters">
      {chapters.map((chapter) => {
        const isActive = chapter.id === currentChapterId;
        return (
          <div
            key={chapter.id}
            className={`flex flex-col items-center px-2 py-1 rounded cursor-pointer ${isActive ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            <span className="text-sm font-medium">{chapter.name}</span>
            <span className="text-xs">{chapter.progress}%</span>
          </div>
        );
      })}
    </nav>
  );
}