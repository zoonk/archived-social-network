import { useContext, useEffect, useState } from 'react';
import NextLink from 'next/link';
import { Button, Card, CardContent, Typography } from '@material-ui/core';
import { Post } from '@zoonk/models';
import { getNextLesson, getPreviousLesson } from '@zoonk/services';
import {
  containsYoutubeUrl,
  GlobalContext,
  postFont,
  theme,
} from '@zoonk/utils';
import EditorView from './EditorView';
import ItemActions from './ItemActions';
import LinkList from './LinkList';
import TopicChips from './TopicChips';
import YoutubePlayer from './YoutubePlayer';

interface PostViewProps {
  chapterId?: string;
  item: Post.Get;
  topicId?: string;
}

/**
 * Display a post view.
 */
const PostView = ({ chapterId, item, topicId }: PostViewProps) => {
  const { translate, user } = useContext(GlobalContext);
  const {
    category,
    createdById,
    content,
    id,
    likes,
    links,
    sites,
    title,
    topics,
  } = item;
  const youtube = links?.find((link) => containsYoutubeUrl(link));
  const youtubeId = containsYoutubeUrl(youtube);
  const [previous, setPrevious] = useState<Post.NextLesson | null>(null);
  const [next, setNext] = useState<Post.NextLesson | null>(null);
  const isAuthoral = category === 'posts' || category === 'questions';
  const isEditable = !isAuthoral || createdById === user?.uid;

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

  useEffect(() => {
    let active = true;

    if (category === 'lessons' && chapterId && topicId) {
      getPreviousLesson(chapterId, id, topicId).then(
        (res) => active && setPrevious(res),
      );
    }

    return () => {
      active = false;
    };
  }, [category, chapterId, id, topicId]);

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography
          variant="h5"
          component="h1"
          style={{ fontFamily: postFont }}
        >
          {title}
        </Typography>
        <TopicChips items={topics} />
        <ItemActions
          category="posts"
          href="/posts/[id]"
          linkAs={`/posts/${id}`}
          id={id}
          likes={likes}
        />
        <EditorView content={content} />
        <LinkList sites={sites} />

        {links && youtubeId && <YoutubePlayer id={youtubeId} />}

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            margin: theme.spacing(2, 0),
          }}
        >
          {previous && (
            <NextLink
              href="/topics/[id]/chapters/[chapterId]/[lessonId]"
              as={`/topics/${topicId}/chapters/${previous.chapterId}/${previous.lessonId}`}
              passHref
            >
              <Button component="a" color="primary" variant="contained">
                {translate('previous_lesson')}
              </Button>
            </NextLink>
          )}

          {next && (
            <NextLink
              href="/topics/[id]/chapters/[chapterId]/[lessonId]"
              as={`/topics/${topicId}/chapters/${next.chapterId}/${next.lessonId}`}
              passHref
            >
              <Button component="a" color="primary" variant="contained">
                {translate('next_lesson')}
              </Button>
            </NextLink>
          )}
        </div>

        {isEditable && (
          <NextLink href="/posts/[id]/edit" as={`/posts/${id}/edit`} passHref>
            <Button component="a" color="primary">
              {translate('improve_page')}
            </Button>
          </NextLink>
        )}
      </CardContent>
    </Card>
  );
};

export default PostView;
