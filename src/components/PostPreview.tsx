import { Fragment, useContext } from 'react';
import { Button } from '@material-ui/core';
import { Post } from '@zoonk/models';
import { serializeLinkCollection } from '@zoonk/serializers';
import { GlobalContext, theme } from '@zoonk/utils';
import PostView from './PostView';

interface PostPreviewProps {
  data: Partial<Post.Get>;
  onReturn: () => void;
}

/**
 * Display a post preview.
 */
const PostPreview = ({ data, onReturn }: PostPreviewProps) => {
  const { translate } = useContext(GlobalContext);
  const { content, links, title, topics } = data;
  return (
    <Fragment>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: theme.spacing(2),
        }}
      >
        <Button variant="contained" color="secondary" onClick={onReturn}>
          {translate('preview_quit')}
        </Button>
      </div>
      <PostView
        item={
          {
            content,
            links: links ? links.filter(Boolean) : null,
            sites: serializeLinkCollection(links),
            title,
            topics,
          } as any
        }
        preview
      />
    </Fragment>
  );
};

export default PostPreview;
