import { Fragment, useContext } from 'react';
import dynamic from 'next/dynamic';
import { PostContext } from '@zoonk/utils';
import BottomBar from './BottomBar';
import PostBarActions from './PostBarActions';
import useAuth from './useAuth';

const PostBarLessons = dynamic(() => import('./PostBarLessons'));

const PostBar = () => {
  const { user } = useAuth();
  const { category, chapterId, createdById, id, likes, topics } = useContext(
    PostContext,
  );
  const isAuthoral = category === 'posts' || category === 'questions';
  const isModerator = user?.role === 'admin' || user?.role === 'moderator';
  const isEditable = !isAuthoral || createdById === user?.uid || isModerator;

  return (
    <Fragment>
      <BottomBar>
        <PostBarActions canEdit={isEditable} id={id} likes={likes} />
        {category === 'lessons' && chapterId && (
          <PostBarLessons
            category={category}
            postId={id}
            chapterId={chapterId}
            topicId={topics[0]}
          />
        )}
      </BottomBar>
    </Fragment>
  );
};

export default PostBar;
