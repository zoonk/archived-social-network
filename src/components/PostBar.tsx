import { Fragment, useContext } from 'react';
import dynamic from 'next/dynamic';
import { Post } from '@zoonk/models';
import { GlobalContext } from '@zoonk/utils';
import BottomBar from './BottomBar';
import PostBarActions from './PostBarActions';

const PostBarLessons = dynamic(() => import('./PostBarLessons'));

interface PostBarProps {
  data: Post.Get;
}

const PostBar = ({ data }: PostBarProps) => {
  const { user } = useContext(GlobalContext);
  const { category, chapterId, createdById, id, likes, topics } = data;
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
