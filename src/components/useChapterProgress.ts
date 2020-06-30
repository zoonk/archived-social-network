import { useEffect, useState } from 'react';
import { Chapter, ChapterProgress } from '@zoonk/models';
import { getChapterProgress } from '@zoonk/services';
import { getChapterCompleted } from '@zoonk/utils';
import useAuth from './useAuth';

interface ProgressResponse {
  completed: number;
  progress: ChapterProgress.Response | undefined;
}

interface ProgressProps {
  chapter?: Chapter.Get | null;
  chapterId?: string;
}

const useChapterProgress = ({
  chapter,
  chapterId,
}: ProgressProps): ProgressResponse => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<ChapterProgress.Response>();
  const [completed, setCompleted] = useState<number>(0);

  useEffect(() => {
    if (chapterId && user) {
      getChapterProgress(chapterId, user.uid).then(setProgress);
    }
  }, [chapterId, user]);

  useEffect(() => {
    if (chapter && progress) {
      setCompleted(getChapterCompleted(chapter, progress));
    }
  }, [chapter, progress]);

  return { completed, progress };
};

export default useChapterProgress;
