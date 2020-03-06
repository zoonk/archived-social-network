import { useContext } from 'react';
import { useRouter } from 'next/router';
import { Post } from '@zoonk/models';
import { GlobalContext, getPageTitle, theme } from '@zoonk/utils';
import EditorView from './EditorView';

interface NoLessonsProps {
  category: Post.Category;
}

/**
 * Display a message when no lessons are found for a request.
 */
const NoLessons = ({ category }: NoLessonsProps) => {
  const { translate } = useContext(GlobalContext);
  const { query } = useRouter();
  const topicId = String(query.id);
  const chapterId = String(query.chapterId);
  const title = getPageTitle(topicId);
  const msg = category === 'examples' ? 'no_chapter_examples' : 'no_lessons';

  return (
    <div style={{ margin: theme.spacing(2, 0) }}>
      <EditorView content={translate(msg, { title, topicId, chapterId })} />
    </div>
  );
};

export default NoLessons;
