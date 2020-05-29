import { Fragment } from 'react';
import NextLink from 'next/link';
import { Button } from '@material-ui/core';
import Typography from '../Typography';

interface TeachLessonProps {
  id: string;
  title: string;
}

const TeachExample = ({ id, title }: TeachLessonProps) => {
  return (
    <Fragment>
      <Typography gutterBottom>
        Na escola, normalmente memorizamos informações para passar em provas.
        Mas a gente aprende melhor quando vê exemplos de como a teoria funciona
        na prática.
      </Typography>
      <Typography gutterBottom>
        O Zoonk tem uma sessão de “exemplos da vida real”, onde você pode
        mostrar como as coisas funcionam no cotidiano. Por exemplo, qual a
        importância de {title} na vida das pessoas? Ajude-as a entender por que
        esse assunto é relevante para elas.
      </Typography>
      <NextLink href={`/posts/add?category=examples&topicId=${id}`} passHref>
        <Button component="a" variant="outlined" color="primary">
          Compartilhar exemplo prático
        </Button>
      </NextLink>
    </Fragment>
  );
};

export default TeachExample;
