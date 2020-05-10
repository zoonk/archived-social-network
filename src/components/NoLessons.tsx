import { useContext } from 'react';
import { Post } from '@zoonk/models';
import { GlobalContext, getPageTitle, theme } from '@zoonk/utils';
import EditorView from './EditorView';

interface NoLessonsProps {
  category: Post.Category;
  chapterId: string;
  topicId: string;
}

/**
 * Display a message when no lessons are found for a request.
 */
const NoLessons = ({ category, chapterId, topicId }: NoLessonsProps) => {
  const { translate } = useContext(GlobalContext);
  const title = getPageTitle(topicId);
  const msg = category === 'examples' ? 'no_chapter_examples' : 'no_lessons';

  return (
    <div style={{ margin: theme.spacing(2, 0) }}>
      <EditorView content={translate(msg, { title, topicId, chapterId })} />
    </div>
  );
};

export default NoLessons;
