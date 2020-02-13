import { useContext, useEffect, useState } from 'react';
import NextLink from 'next/link';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from '@material-ui/core';
import { Post } from '@zoonk/models';
import { getNextLesson } from '@zoonk/services';
import { containsYoutubeUrl, GlobalContext, theme } from '@zoonk/utils';
import EditorView from './EditorView';
import ItemActions from './ItemActions';
import TopicChips from './TopicChips';
import YoutubePlayer from './YoutubePlayer';

interface PostViewProps {
  item: Post.Get;
  preview?: boolean;
}

/**
 * Display a post view.
 */
const PostView = ({ item, preview }: PostViewProps) => {
  const { translate } = useContext(GlobalContext);
  const {
    chapterId,
    content,
    id,
    likes,
    links,
    order,
    sites,
    title,
    topics,
  } = item;
  const youtube = links?.find((link) => containsYoutubeUrl(link));
  const [next, setNext] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    if (chapterId && order) {
      getNextLesson(chapterId, order).then((res) => active && setNext(res));
    }

    return () => {
      active = false;
    };
  }, [chapterId, order]);

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h4" component="h1">
          {title}
        </Typography>
        <TopicChips items={topics} />
        {!preview && (
          <ItemActions category="posts" id={id} likes={likes} title={title} />
        )}
        <EditorView content={content} />
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
      {next && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            margin: theme.spacing(2),
          }}
        >
          <NextLink href="/posts/[id]" as={`/posts/${next}`} passHref>
            <Button component="a" color="primary" variant="contained">
              {translate('next_lesson')}
            </Button>
          </NextLink>
        </div>
      )}
    </Card>
  );
};

export default PostView;
