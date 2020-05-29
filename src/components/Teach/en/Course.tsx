import { Fragment } from 'react';
import NextLink from 'next/link';
import { Link } from '@material-ui/core';
import Typography from '../Typography';

interface TeachCourseProps {
  id: string;
  title: string;
}

const TeachCourse = ({ id, title }: TeachCourseProps) => {
  return (
    <Fragment>
      <Typography>
        Have you completed a course that helped you learn something? Then, help
        other people to learn it too!{' '}
        <NextLink href={`/posts/add?category=courses&topicId=${id}`} passHref>
          <Link>Share a course about {title}</Link>
        </NextLink>
        .
      </Typography>
    </Fragment>
  );
};

export default TeachCourse;
