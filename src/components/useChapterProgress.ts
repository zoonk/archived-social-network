import { useEffect, useState } from 'react';
import { Chapter, ChapterProgress } from '@zoonk/models';
import { getChapterProgress } from '@zoonk/services';
import { getChapterCompleted } from '@zoonk/utils';
import useAuth from './useAuth';

interface useChapterProgressProps {
  completed: number;
  progress: ChapterProgress.Response | undefined;
}

const useChapterProgress = (
  chapter: Chapter.Get | null,
): useChapterProgressProps => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<ChapterProgress.Response>();
  const [completed, setCompleted] = useState<number>(0);

  useEffect(() => {
    if (chapter?.id && user) {
      getChapterProgress(chapter?.id, user.uid).then(setProgress);
    }
  }, [chapter, user]);

  useEffect(() => {
    if (chapter && progress) {
      setCompleted(getChapterCompleted(chapter, progress));
    }
  }, [chapter, progress]);

  return { completed, progress };
};

export default useChapterProgress;
