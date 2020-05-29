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
        Uma boa maneira de ensinar é compartilhando histórias e experiências
        pessoais. Você tem algum ponto de vista interessante sobre
        {title}? Então{' '}
        <NextLink href={`/posts/add?category=posts&topicId=${id}`} passHref>
          <Link>compartilhe com outras pessoas</Link>
        </NextLink>
        ! 🤓
      </Typography>
    </Fragment>
  );
};

export default TeachArticle;
