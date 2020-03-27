import { useContext, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from '@material-ui/core';
import { Post } from '@zoonk/models';
import { serializeLinkCollection } from '@zoonk/serializers';
import { containsYoutubeUrl, GlobalContext } from '@zoonk/utils';
import EditorView from './EditorView';
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
  const { content, links, title, topics } = data;
  const sites = serializeLinkCollection(links);
  const youtube = links?.find((link) => containsYoutubeUrl(link));

  useEffect(() => {
    if (onToggleExpand) onToggleExpand(expand);
  }, [expand, onToggleExpand]);

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
        </CardContent>

        {links && links.length > 0 && (
          <CardActions>
            {sites.map((site) => (
              <Button
                key={site.url}
                component="a"
                size="small"
                color="primary"
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {site.title}
              </Button>
            ))}
          </CardActions>
        )}

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
