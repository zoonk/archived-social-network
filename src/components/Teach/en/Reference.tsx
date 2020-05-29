import { Fragment } from 'react';
import NextLink from 'next/link';
import { Link } from '@material-ui/core';
import Typography from '../Typography';

interface TeachRefProps {
  id: string;
  title: string;
}

const TeachReference = ({ id, title }: TeachRefProps) => {
  return (
    <Fragment>
      <Typography>
        Do you remember a cool link or reference someone shared with you? Then,{' '}
        <NextLink
          href={`/posts/add?category=references&topicId=${id}`}
          passHref
        >
          <Link>share it with other people</Link>
        </NextLink>{' '}
        and help them find the best sources about {title}.
      </Typography>
    </Fragment>
  );
};

export default TeachReference;
