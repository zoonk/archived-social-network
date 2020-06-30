import { db } from '@zoonk/firebase/db';
import { Topic, TopicProgress, UserProgress } from '@zoonk/models';
import { sum } from '@zoonk/utils';

export const getTopicProgress = async (
  topic: Topic.Get,
  userId: string,
): Promise<UserProgress.Topic> => {
  const progress = await db.doc(`topics/${topic.id}/progress/${userId}`).get();
  const data = progress.data() as TopicProgress | undefined;

  if (!data) return { progress: 0 };

  const userPosts: number = sum(Object.values(data), 'posts');
  if (userPosts === 0) return { progress: 0 };

  const topicPosts: number = sum(topic.chapterData, 'posts');
  return { progress: (userPosts / topicPosts) * 100 };
};
