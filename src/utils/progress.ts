import {
  Chapter,
  ChapterProgress,
  TopicProgress,
  UserProgress,
} from '@zoonk/models';

export const getChapterStatus = (
  chapter: Chapter.Summary,
  progress?: TopicProgress,
): UserProgress.ChapterStatus => {
  const chapterData = progress?.[chapter.id];
  const userPosts = chapterData?.posts || 0;

  if (userPosts === 0) return 'notStarted';

  const chapterPosts = chapter.posts;

  if (userPosts < chapterPosts) return 'started';
  return 'completed';
};

export const getChapterCompleted = (
  chapter: Chapter.Get,
  progress: ChapterProgress.Response,
): number => {
  const chapterPosts = chapter.posts;
  const userExamples = progress.examples?.length || 0;
  const userLessons = progress.lessons?.length || 0;
  const userPosts = userExamples + userLessons;

  return (userPosts / chapterPosts) * 100;
};

export const getLessonStatus = (
  category: keyof ChapterProgress.Response,
  itemId: string,
  progress?: ChapterProgress.Response,
): 'completed' | 'notStarted' => {
  if (!progress) return 'notStarted';
  if (progress[category]?.includes(itemId)) return 'completed';
  return 'notStarted';
};
