import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from '@material-ui/core';
import { Post } from '@zoonk/models';
import { serializeLinkCollection } from '@zoonk/serializers';
import { containsYoutubeUrl } from '@zoonk/utils';
import EditorView from './EditorView';
import TopicChips from './TopicChips';
import YoutubePlayer from './YoutubePlayer';

interface PostPreviewProps {
  data: Partial<Post.Get>;
  expand?: boolean;
}

/**
 * Display a post preview.
 */
const PostPreview = ({ data, expand }: PostPreviewProps) => {
  const { content, links, title, topics } = data;
  const sites = serializeLinkCollection(links);
  const youtube = links?.find((link) => containsYoutubeUrl(link));

  return (
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
  );
};

export default PostPreview;
