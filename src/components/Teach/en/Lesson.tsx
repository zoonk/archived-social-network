import { Fragment } from 'react';
import NextLink from 'next/link';
import { Link } from '@material-ui/core';
import Typography from '../Typography';

interface TeachLessonProps {
  id: string;
  title: string;
}

const TeachLesson = ({ id, title }: TeachLessonProps) => {
  return (
    <Fragment>
      <Typography gutterBottom>
        Many people don’t know how to start learning something. Help them by
        creating lessons. Here are some of the things you can do:
      </Typography>
      <Typography gutterBottom>
        Check if other people have created{' '}
        <NextLink href="/topics/[id]" as={`/topics/${id}`} passHref>
          <Link>chapters for {title}</Link>
        </NextLink>
        . If they haven’t, then start by creating the first chapter yourself.
        Create an introduction to start teaching your favorite subject.
      </Typography>
      <Typography>
        Every chapter supports up to 20 lessons. You can create new lessons or
        improving the existing ones. Zoonk is collaborative: anyone can improve
        existing lessons.
      </Typography>
    </Fragment>
  );
};

export default TeachLesson;
