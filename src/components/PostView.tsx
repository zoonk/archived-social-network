import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from '@material-ui/core';
import { Post } from '@zoonk/models';
import { containsYoutubeUrl } from '@zoonk/utils';
import EditorView from './EditorView';
import ItemActions from './ItemActions';
import TopicChips from './TopicChips';
import YoutubePlayer from './YoutubePlayer';

interface PostViewProps {
  item: Post.Get;
}

/**
 * Display a post view.
 */
const PostView = ({ item }: PostViewProps) => {
  const { content, id, likes, links, sites, title, topics } = item;
  const youtube = links ? containsYoutubeUrl(links[0]) : null;

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h4" component="h1">
          {title}
        </Typography>
        <TopicChips items={topics} />
        <ItemActions category="posts" id={id} likes={likes} title={title} />
        <EditorView content={content} />
      </CardContent>

      {links && links.length > 0 && !youtube && (
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

export default PostView;
