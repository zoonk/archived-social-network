import { makeStyles } from '@material-ui/core';
import EditorView from './EditorView';

interface PostViewProps {
  content: string;
}

const useStyles = makeStyles(() => ({
  article: {
    fontFamily: "'Raleway', sans-serif",
  },
}));

const PostView = ({ content }: PostViewProps) => {
  const classes = useStyles();

  return (
    <article className={classes.article}>
      <EditorView content={content} />
    </article>
  );
};

export default PostView;
