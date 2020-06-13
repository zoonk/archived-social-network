import { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { Button } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import { Post } from '@zoonk/models';
import { getPreviousLesson } from '@zoonk/services';
import useTranslation from './useTranslation';

interface PreviousLessonProps {
  chapterId: string;
  postId: string;
  topicId: string;
}

const PreviousLesson = ({
  chapterId,
  postId,
  topicId,
}: PreviousLessonProps) => {
  const translate = useTranslation();
  const [previous, setPrevious] = useState<Post.NextLesson | null>(null);

  useEffect(() => {
    let active = true;

    getPreviousLesson(chapterId, postId, topicId).then(
      (res) => active && setPrevious(res),
    );

    return () => {
      active = false;
    };
  }, [chapterId, postId, topicId]);

  if (!previous) return null;

  return (
    <NextLink href="/posts/[id]" as={`/posts/${previous.lessonId}`} passHref>
      <Button
        color="primary"
        variant="outlined"
        startIcon={<ArrowBack style={{ margin: 0 }} />}
        component="a"
      >
        {translate('previous')}
      </Button>
    </NextLink>
  );
};

export default PreviousLesson;
