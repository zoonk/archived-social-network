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
        Lembra de algum link ou referência legal que compartilharam no grupo do
        Zap ou que você viu por aí? Então,{' '}
        <NextLink
          href={`/posts/add?category=references&topicId=${id}`}
          passHref
        >
          <Link>compartilhe com outras pessoas</Link>
        </NextLink>{' '}
        e ajude a galera a encontrar as melhores fontes de informação sobre{' '}
        {title}.
      </Typography>
    </Fragment>
  );
};

export default TeachReference;
