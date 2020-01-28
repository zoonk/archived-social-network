import { Fragment } from 'react';
import NextLink from 'next/link';
import { Link, Typography } from '@material-ui/core';

const TermsPt = () => {
  return (
    <Fragment>
      <Typography component="p" variant="body1" gutterBottom>
        Ao usar quaisquer serviços fornecidos pelo Zoonk, você concorda com os
        seguintes termos:
      </Typography>

      <ul>
        <Typography component="li" variant="body1">
          Você aceita a nossa{' '}
          <NextLink href="/privacy" passHref>
            <Link>política de privacidade</Link>
          </NextLink>
        </Typography>

        <Typography component="li" variant="body1">
          Você possui 13 (treze) anos ou mais.
        </Typography>

        <Typography component="li" variant="body1">
          Você é responsável pelo seu próprio conteúdo publicado na plataforma.
        </Typography>

        <Typography component="li" variant="body1">
          O conteúdo publicado por você não fere nenhuma lei.
        </Typography>
      </ul>

      <Typography component="h2" variant="h5" gutterBottom>
        Código de conduta
      </Typography>

      <Typography component="p" variant="body1" gutterBottom>
        Ao usar o Zoonk, você concorda em seguir o{' '}
        <Link href="https://www.contributor-covenant.org/pt-br/version/1/4/code-of-conduct">
          Código de Conduta para Colaboradores
        </Link>
        .
      </Typography>

      <Typography component="p" variant="body1" gutterBottom>
        Nós almejamos criar uma comunidade inclusiva para todos,
        independentemente da aparência pessoal, deficiência, etnia, gênero,
        idade, identidade ou expressão de gênero, identidade ou orientação
        sexual, nacionalidade, nível de experiência, porte físico, raça ou
        religião.
      </Typography>

      <Typography component="p" variant="body1" gutterBottom>
        Portanto, não aceitaremos quaisquer formas de bullying, perseguição,
        assédio ou discriminação. Isso inclui, mas não se limita, a:
      </Typography>

      <ul>
        <Typography component="li" variant="body1">
          Linguagem ou comportamento discriminatório com qualquer indivíduo ou
          grupo de pessoas.
        </Typography>

        <Typography component="li" variant="body1">
          Linguagem ou comportamento desrespeitoso com qualquer indivíduo ou
          grupo de pessoas.
        </Typography>
      </ul>

      <Typography component="p" variant="body1" gutterBottom>
        Não aceitaremos conteúdo propagando informações falsas. Isso inclui, mas
        não se limita a:
      </Typography>

      <ul>
        <Typography component="li" variant="body1">
          Conteúdo cuja vericidade não tenha sido comprovada pela comunidade
          científica ou por múltiplos veículos de comunicação.
        </Typography>

        <Typography component="li" variant="body1">
          Teorias da conspiração ou conteúdo sensacionalista.
        </Typography>

        <Typography component="li" variant="body1">
          Conteúdos visando manipular informações, indivíduos ou grupos de
          pessoas.
        </Typography>

        <Typography component="li" variant="body1">
          Propaganda política.
        </Typography>

        <Typography component="li" variant="body1">
          Esquemas de pirâmide ou outras práticas similares.
        </Typography>
      </ul>

      <Typography component="h2" variant="h5" gutterBottom>
        Suspension
      </Typography>

      <Typography component="p" variant="body1" gutterBottom>
        A sua conta pode ser suspensa ou banida se você quebrar qualquer regra
        definida aqui. Se a sua conta for suspensa, você pode apelar da decisão
        enviando um e-mail para support@zoonk.org.
      </Typography>

      <Typography component="h2" variant="h5" gutterBottom>
        Descumprimento
      </Typography>

      <Typography component="p" variant="body1" gutterBottom>
        Se você ver qualquer pessoa ou conteúdo descumprindo os termos de uso,
        por favor{' '}
        <NextLink href="/contact" passHref>
          <Link>entre em contato</Link>
        </NextLink>
        .
      </Typography>
    </Fragment>
  );
};

export default TermsPt;
