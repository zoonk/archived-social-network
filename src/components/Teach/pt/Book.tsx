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
        Você leu algum livro interessante sobre {title}? Não guarde esse achado
        apenas com você, outras pessoas podem se beneficiar dessa leitura.{' '}
        <NextLink href={`/posts/add?category=books&topicId=${id}`} passHref>
          <Link>Compartilhe um pequeno resumo do livro</Link>
        </NextLink>{' '}
        e fale por que ele é interessante para quem quiser aprender sobre{' '}
        {title}.
      </Typography>
    </Fragment>
  );
};

export default TeachBook;
