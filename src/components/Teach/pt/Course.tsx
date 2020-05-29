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
      <Typography gutterBottom>
        Você fez algum curso interessante que te ajudou a aprender algo? Então,
        ajude outras pessoas a aprender também!{' '}
        <NextLink href={`/posts/add?category=courses&topicId=${id}`} passHref>
          <Link>Compartilhe um curso sobre {title}</Link>
        </NextLink>
        .
      </Typography>
    </Fragment>
  );
};

export default TeachCourse;
