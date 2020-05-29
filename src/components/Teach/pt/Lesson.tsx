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
        Muitas pessoas não sabem por onde começar a aprender. Crie aulas para
        ajudá-las nesse caminho. Algumas coisas que você pode fazer:
      </Typography>
      <Typography gutterBottom>
        Veja se já existem alguns{' '}
        <NextLink href="/topics/[id]" as={`/topics/${id}`} passHref>
          <Link>capítulos para {title}</Link>
        </NextLink>
        . Caso contrário, comece criando um capítulo introdutório para ensinar
        sobre o assunto que desejar.
      </Typography>
      <Typography>
        Cada capítulo pode ter até 20 aulas. Crie novas ou melhore as que já
        existem. O Zoonk é colaborativo: qualquer um pode melhorar as aulas
        existentes.
      </Typography>
    </Fragment>
  );
};

export default TeachLesson;
