import { Chapter, TopicProgress, UserProgress } from '@zoonk/models';

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
