import { Fragment } from 'react';
import { Link, Typography } from '@material-ui/core';
import Divider from '../Divider';
import YoutubePlayer from '../YoutubePlayer';

const AboutPt = () => {
  return (
    <Fragment>
      <Typography gutterBottom>
        O Zoonk é um site <strong>gratuito e aberto</strong> para compartilhar
        fontes de aprendizado. Nós querermos fazer com qualquer um consiga
        facilmente aprender coisas novas e compreender{' '}
        <strong>como esse conhecimento é útil no dia-a-dia</strong>.
      </Typography>

      <Divider />

      <Typography variant="h4" gutterBottom>
        Por que o Zoonk é importante?
      </Typography>

      <Typography gutterBottom>
        O nosso <strong>sistema de ensino não mudou</strong> muito desde a
        Revolução Industrial. Nós apenas decoramos informação para passar nas
        provas. Por isso, que a{' '}
        <Link
          href="https://www.nais.org/media/MemberDocuments/Research/2017-HSSSE-Final.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          maioria das pessoas
        </Link>{' '}
        acha a <strong>escola chata</strong>. Elas não entendem como o conteúdo
        escolar será útil na vida delas.
      </Typography>

      <Typography gutterBottom>
        Nós estamos vivendo a consequência disso: uma{' '}
        <strong>onda de notícias falsas e negadores da ciência</strong>. Isso
        acontece porque as pessoas não se interessam mais pelo conhecimento. Nas
        próximas décadas, vamos enfrentar um desafio ainda maior: a maior parte
        da população não estará preparada para os{' '}
        <strong>desafios causados pela automação</strong>.
      </Typography>

      <Typography gutterBottom>
        A gente precisa estimular as pessoas ao{' '}
        <strong>aprendizado contínuo</strong> e tornar mais fácil para qualquer
        um entender como conceitos complexos (ex. método científico) são úteis
        no dia-a-dia dessas pessoas. O nosso objetivo é{' '}
        <strong>
          trazer experiências de aprendizado interessantes para o cidadão comum
        </strong>
        : aquelas pessoas que não teriam a oportunidade de ter uma educação de
        qualidade. Dessa forma, estaremos{' '}
        <strong>
          preparando essas pessoas para uma sociedade que está sempre mudando
        </strong>
        .
      </Typography>

      <Typography gutterBottom>
        No longo-prazo, precisamos garantir que{' '}
        <strong>
          aprender seja tão fácil e divertido quanto jogar vídeo game
        </strong>{' '}
        ou postar uma selfie em uma rede social.
      </Typography>

      <YoutubePlayer id="dqTTojTija8" />

      <Divider />

      <Typography variant="h4" gutterBottom>
        Mais informações
      </Typography>

      <ul>
        <li>
          <Link
            href="https://github.com/zoonk/culture/tree/master/pt-BR#objetivos"
            target="_blank"
            rel="noopener noreferrer"
          >
            Nossos objetivos
          </Link>
        </li>
        <li>
          <Link
            href="https://github.com/zoonk/culture/tree/master/pt-BR#nossos-valores"
            target="_blank"
            rel="noopener noreferrer"
          >
            Nossos valores
          </Link>
        </li>
        <li>
          <Link
            href="https://github.com/zoonk/culture/tree/master/pt-BR#desafios"
            target="_blank"
            rel="noopener noreferrer"
          >
            Desafios
          </Link>
        </li>
        <li>
          <Link
            href="https://github.com/zoonk/culture/tree/master/pt-BR#como-posso-ajudar"
            target="_blank"
            rel="noopener noreferrer"
          >
            Como posso ajudar?
          </Link>
        </li>
        <li>
          <Link
            href="https://github.com/zoonk/culture/tree/master/pt-BR#pessoal"
            target="_blank"
            rel="noopener noreferrer"
          >
            Equipe
          </Link>
        </li>
      </ul>
    </Fragment>
  );
};

export default AboutPt;
