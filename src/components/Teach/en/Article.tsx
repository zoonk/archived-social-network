import { Fragment } from 'react';
import NextLink from 'next/link';
import { Link } from '@material-ui/core';
import Typography from '../Typography';

interface TeachArticleProps {
  id: string;
  title: string;
}

const TeachArticle = ({ id, title }: TeachArticleProps) => {
  return (
    <Fragment>
      <Typography>
        A good way to teach something is by sharing personal stories and
        experiences. Do you have an interesting point of view about
        {title}? Then,{' '}
        <NextLink href={`/posts/add?category=posts&topicId=${id}`} passHref>
          <Link>share it with other people</Link>
        </NextLink>
        ! 🤓
      </Typography>
    </Fragment>
  );
};

export default TeachArticle;
