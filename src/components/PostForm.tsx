import dynamic from 'next/dynamic';
import { CircularProgress } from '@material-ui/core';
import { Post } from '@zoonk/models';
import { editorEnabled } from '@zoonk/utils';
import EditorDisabled from './EditorDisabled';

const PostsForm = dynamic(() => import('./PostsForm'));
const ReferencesForm = dynamic(() => import('./ReferencesForm'));

interface PostFormProps {
  category: Post.Category | 'none';
  data?: Post.Get;
  saving: boolean;
  topicIds?: string[];
  onSubmit: (
    data: Omit<Post.EditableFields, 'pinned'>,
    topics: string[],
  ) => void;
}

const PostForm = (props: PostFormProps) => {
  const { category } = props;

  if (editorEnabled() === undefined) return <CircularProgress />;
  if (editorEnabled() === false) return <EditorDisabled />;

  switch (category) {
    case 'posts':
      return <PostsForm {...props} />;
    case 'references':
      return <ReferencesForm {...props} />;
    case 'none':
      return null;
    default:
      return <PostsForm {...props} />;
  }
};

export default PostForm;
