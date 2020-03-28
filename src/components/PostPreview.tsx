import { useContext, useEffect, useState } from 'react';
import { Button, Card, CardContent, Typography } from '@material-ui/core';
import { Post } from '@zoonk/models';
import { getLinkMetadata } from '@zoonk/services';
import { containsYoutubeUrl, GlobalContext } from '@zoonk/utils';
import EditorView from './EditorView';
import LinkList from './LinkList';
import TopicChips from './TopicChips';
import YoutubePlayer from './YoutubePlayer';

interface PostPreviewProps {
  data: Partial<Post.Get>;
  onToggleExpand?: (value: boolean) => void;
}

/**
 * Display a post preview.
 */
const PostPreview = ({ data, onToggleExpand }: PostPreviewProps) => {
  const { translate } = useContext(GlobalContext);
  const [expand, setExpand] = useState<boolean>(false);
  const [sites, setSites] = useState<Post.Link[]>([]);
  const { content, links, title, topics } = data;
  const youtube = links?.find((link) => containsYoutubeUrl(link));

  useEffect(() => {
    if (onToggleExpand) onToggleExpand(expand);
  }, [expand, onToggleExpand]);

  useEffect(() => {
    if (links && links.length > 0) {
      const promises = links
        .filter(Boolean)
        .map((link) => getLinkMetadata(link));
      Promise.all(promises).then(setSites);
    }
  }, [links]);

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        {translate('preview')}
      </Typography>
      <Card
        variant="outlined"
        style={{
          height: expand ? 'auto' : '500px',
          overflow: expand ? 'hidden' : 'auto',
        }}
      >
        <CardContent>
          <Typography variant="h4" component="h1">
            {title}
          </Typography>
          <TopicChips items={topics || []} />
          <EditorView content={content || ''} />
          <LinkList sites={sites} />
        </CardContent>
        {links && youtube && <YoutubePlayer id={youtube} />}
      </Card>

      {onToggleExpand && (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button color="primary" onClick={() => setExpand(!expand)}>
            {expand ? translate('collapse') : translate('expand')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PostPreview;
