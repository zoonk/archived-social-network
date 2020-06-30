import { Fragment, useContext } from 'react';
import dynamic from 'next/dynamic';
import { PostContext } from '@zoonk/utils';
import BottomBar from './BottomBar';
import PostBarActions from './PostBarActions';

const PostBarLessons = dynamic(() => import('./PostBarLessons'));

const PostBar = () => {
  const { category, chapterId, id, likes, topics } = useContext(PostContext);

  return (
    <Fragment>
      <BottomBar>
        <PostBarActions id={id} likes={likes} />
        {(category === 'lessons' || category === 'examples') && chapterId && (
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
