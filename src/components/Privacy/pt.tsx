import { Fragment } from 'react';
import NextLink from 'next/link';
import { Link, Typography } from '@material-ui/core';

const PrivacyEn = () => {
  return (
    <Fragment>
      <Typography component="h2" variant="h5" gutterBottom>
        Quais informações o Zoonk armazena e por quê
      </Typography>

      <Typography component="p" variant="body1" gutterBottom>
        Para melhorar a sua experiência, nós armazenamos informações básicas
        sobre a sua visita:
      </Typography>

      <ul>
        <Typography component="li" variant="body1">
          Erros que aconteceram enquanto você visitava alguma página.
        </Typography>

        <Typography component="li" variant="body1">
          Ações que você executou como criar, editar ou apagar conteúdo.
        </Typography>

        <Typography component="li" variant="body1">
          O seu navegador.
        </Typography>

        <Typography component="li" variant="body1">
          O site de referência.
        </Typography>

        <Typography component="li" variant="body1">
          O seu endereço de IP.
        </Typography>
      </ul>

      <Typography component="p" variant="body1" gutterBottom>
        Nós usamos essas informações para melhorar a sua experiência, mas também
        para combater vandalismo e spam na comunidade.
      </Typography>

      <Typography component="p" variant="body1" gutterBottom>
        Note que nós <strong>não vendemos os seus dados</strong> para ninguém.
      </Typography>

      <Typography component="h2" variant="h5" gutterBottom>
        Serviços de terceiros
      </Typography>

      <Typography component="p" variant="body1" gutterBottom>
        Nós dependemos de alguns serviços terceirizados para rodar o Zoonk:
      </Typography>

      <Typography component="h3" variant="h6" gutterBottom>
        Análise de dados
      </Typography>

      <ul>
        <Typography component="li" variant="body1">
          <Link href="https://firebase.google.com/products/analytics">
            Google Analytics for Firebase
          </Link>
        </Typography>
      </ul>

      <Typography component="h3" variant="h6" gutterBottom>
        Autenticação
      </Typography>

      <ul>
        <Typography component="li" variant="body1">
          <Link href="https://firebase.google.com/products/auth/">
            Firebase Authentication
          </Link>
        </Typography>
      </ul>

      <Typography component="h3" variant="h6" gutterBottom>
        Hospedagem
      </Typography>

      <ul>
        <Typography component="li" variant="body1">
          <Link href="https://vercel.com">Vercel</Link>
        </Typography>
      </ul>

      <Typography component="h3" variant="h6" gutterBottom>
        Armazenamento
      </Typography>

      <ul>
        <Typography component="li" variant="body1">
          <Link href="https://firebase.google.com/products/firestore/">
            Google Cloud Firestore
          </Link>
        </Typography>

        <Typography component="li" variant="body1">
          <Link href="https://firebase.google.com/products/storage/">
            Google Cloud Storage
          </Link>
        </Typography>
      </ul>

      <Typography component="h2" variant="h5" gutterBottom>
        Cookies
      </Typography>

      <Typography component="p" variant="body1" gutterBottom>
        Nós não usamos cookies diretamente. Porém, serviços de terceiros, como o
        Google Analytics, utilizam cookies para rastrear as suas visitas. Note
        que esses cookies não nos fornecem nenhuma informação pessoal sua.
      </Typography>

      <Typography component="h2" variant="h5" gutterBottom>
        Excluir os seus dados
      </Typography>

      <Typography component="p" variant="body1" gutterBottom>
        Você pode solicitar a exclusão das suas informações pessoais enviando um
        e-mail para support@zoonk.org. Você também pode solicitar uma cópia dos
        seus dados a qualquer momento. Podemos levar até 30 (trinta) dias para
        atender a sua solicitação.
      </Typography>

      <Typography component="h2" variant="h5" gutterBottom>
        Compromisso
      </Typography>

      <Typography component="p" variant="body1" gutterBottom>
        Estamos comprometidos em melhorar a nossa política e, a longo prazo,
        depender menos de serviços terceirizados que diminuam a sua privacidade.
        Se você tiver quaisquer sugestões sobre como podemos melhorar a nossa
        política de privacidade, por favor{' '}
        <NextLink href="/contact" passHref>
          <Link>entre em contato</Link>
        </NextLink>
        .
      </Typography>
    </Fragment>
  );
};

export default PrivacyEn;
