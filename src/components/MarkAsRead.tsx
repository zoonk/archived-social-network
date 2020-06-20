import { useEffect } from 'react';
import { Post } from '@zoonk/models';
import { markPostAsRead, togglePostProgress } from '@zoonk/services';
import useAuth from './useAuth';

interface MarkAsReadProps {
  data: Post.Get;
}

/**
 * This components loads the business logic for marking
 * a post as read. We're using it as a component instead
 * of a custom hook because we can lazy load it to avoid
 * including the Firebase SDK in the initial load.
 */
const MarkAsRead = ({ data }: MarkAsReadProps) => {
  const { user } = useAuth();

  // Mark a post as read when the page is loaded.
  useEffect(() => {
    if (user) {
      markPostAsRead(data.id, user.uid);
    }
  }, [data, user]);

  /**
   * Save the user progress for this chapter.
   */
  useEffect(() => {
    if (
      user &&
      data &&
      data.chapterId &&
      (data.category === 'examples' || data.category === 'lessons')
    ) {
      togglePostProgress(
        data.id,
        data.chapterId,
        data.category,
        false,
        user.uid,
      );
    }
  }, [data, user]);

  return null;
};

export default MarkAsRead;
