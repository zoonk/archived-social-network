import { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { Button, makeStyles } from '@material-ui/core';
import { ArrowForward } from '@material-ui/icons';
import { Post } from '@zoonk/models';
import { getNextLesson } from '@zoonk/services';
import useTranslation from './useTranslation';

interface NextLessonProps {
  chapterId: string;
  postId: string;
  topicId: string;
}

const useStyles = makeStyles((theme) => ({
  button: {
    marginRight: theme.spacing(0),
    [theme.breakpoints.up('sm')]: {
      marginRight: theme.spacing(0.5),
    },
  },
}));

const NextLesson = ({ chapterId, postId, topicId }: NextLessonProps) => {
  const translate = useTranslation();
  const classes = useStyles();
  const [next, setNext] = useState<Post.NextLesson | null>(null);

  useEffect(() => {
    let active = true;

    getNextLesson(chapterId, postId, topicId).then(
      (res) => active && setNext(res),
    );

    return () => {
      active = false;
    };
  }, [chapterId, postId, topicId]);

  if (!next) return null;

  return (
    <NextLink href="/posts/[id]" as={`/posts/${next.lessonId}`} passHref>
      <Button
        color="primary"
        variant="outlined"
        endIcon={<ArrowForward />}
        component="a"
      >
        <span className={classes.button}>{translate('next')}</span>
      </Button>
    </NextLink>
  );
};

export default NextLesson;
