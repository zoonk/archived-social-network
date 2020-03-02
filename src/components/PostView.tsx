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
  chapterId?: string;
  item: Post.Get;
  preview?: boolean;
  topicId?: string;
}

/**
 * Display a post view.
 */
const PostView = ({ chapterId, item, preview, topicId }: PostViewProps) => {
  const { translate } = useContext(GlobalContext);
  const { category, content, id, likes, links, sites, title, topics } = item;
  const youtube = links?.find((link) => containsYoutubeUrl(link));
  const [next, setNext] = useState<Post.NextLesson | null>(null);

  useEffect(() => {
    let active = true;

    if (category === 'lessons' && chapterId && topicId) {
      getNextLesson(chapterId, id, topicId).then(
        (res) => active && setNext(res),
      );
    }

    return () => {
      active = false;
    };
  }, [category, chapterId, id, topicId]);

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h4" component="h1">
          {title}
        </Typography>
        <TopicChips items={topics} />
        {!preview && (
          <ItemActions
            category="posts"
            href="/posts/[id]"
            linkAs={`/posts/${id}`}
            id={id}
            likes={likes}
          />
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
          <NextLink
            href="/topics/[id]/chapters/[chapterId]/[lessonId]"
            as={`/topics/${topicId}/chapters/${next.chapterId}/${next.lessonId}`}
            passHref
          >
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
