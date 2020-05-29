import { Fragment } from 'react';
import NextLink from 'next/link';
import { Link } from '@material-ui/core';
import Typography from '../Typography';

interface TeachBookProps {
  id: string;
  title: string;
}

const TeachBook = ({ id, title }: TeachBookProps) => {
  return (
    <Fragment>
      <Typography>
        Did you read an interesting book about {title}? Don’t keep this finding
        to yourself. Others might benefit from reading this book too.{' '}
        <NextLink href={`/posts/add?category=books&topicId=${id}`} passHref>
          <Link>Share a brief summary of your book</Link>
        </NextLink>{' '}
        explaining why it might be interesting for those who are trying to learn
        more about {title}.
      </Typography>
    </Fragment>
  );
};

export default TeachBook;
