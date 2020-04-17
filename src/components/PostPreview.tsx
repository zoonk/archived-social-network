import { useContext, useEffect, useState } from 'react';
import { Button, Card, CardContent, Typography } from '@material-ui/core';
import { Post } from '@zoonk/models';
import { getLinkMetadata } from '@zoonk/services';
import {
  containsYoutubeUrl,
  GlobalContext,
  postFont,
  theme,
} from '@zoonk/utils';
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
  const youtubeId = containsYoutubeUrl(youtube);

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
    <div
      style={{
        background: theme.palette.grey[100],
        padding: theme.spacing(2),
        borderRadius: '20px',
        marginTop: theme.spacing(1),
      }}
    >
      <Typography variant="h5" gutterBottom align="center">
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
          <Typography
            variant="h5"
            component="h1"
            style={{ fontFamily: postFont }}
          >
            {title}
          </Typography>
          <TopicChips items={topics || []} />
          <EditorView content={content || ''} />
          <LinkList sites={sites} />
        </CardContent>
        {links && youtubeId && <YoutubePlayer id={youtubeId} />}
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
