import { Fragment } from 'react';
import NextLink from 'next/link';
import { Button } from '@material-ui/core';
import Typography from '../Typography';

interface TeachLessonProps {
  id: string;
  title: string;
}

const TeachExample = ({ id, title }: TeachLessonProps) => {
  return (
    <Fragment>
      <Typography gutterBottom>
        In school, we usually memorize information to pass exams. But we learn
        better when we see practical examples of how things work.
      </Typography>
      <Typography gutterBottom>
        Zoonk has a “real-life examples” section where you can show how things
        work in everyday life. For example, why learning about {title} is
        important for them? Help them understand how this subject is relevant in
        their lives.
      </Typography>
      <NextLink href={`/posts/add?category=examples&topicId=${id}`} passHref>
        <Button component="a" variant="outlined" color="primary">
          Share real-life example
        </Button>
      </NextLink>
    </Fragment>
  );
};

export default TeachExample;
