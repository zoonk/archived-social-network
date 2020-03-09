import { useContext } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Typography,
} from '@material-ui/core';
import { Post } from '@zoonk/models';
import { serializeLinkCollection } from '@zoonk/serializers';
import { containsYoutubeUrl, GlobalContext, theme } from '@zoonk/utils';
import EditorView from './EditorView';
import TopicChips from './TopicChips';
import YoutubePlayer from './YoutubePlayer';

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
  const sites = serializeLinkCollection(links);
  const youtube = links?.find((link) => containsYoutubeUrl(link));

  return (
    <Container maxWidth="sm">
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

      <Card variant="outlined">
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
    </Container>
  );
};

export default PostPreview;
