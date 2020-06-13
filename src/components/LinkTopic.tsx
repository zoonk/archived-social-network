import NextLink from 'next/link';
import { Link } from '@material-ui/core';
import { getPageTitle } from '@zoonk/utils';
import useTranslation from './useTranslation';

interface LinkTopicProps {
  id: string;
}

const LinkTopic = ({ id }: LinkTopicProps) => {
  const translate = useTranslation();
  const title = getPageTitle(id);

  return (
    <NextLink href="/topics/[id]" as={`/topics/${id}`} passHref>
      <Link color="inherit" title={translate('learn_about', { title })}>
        {title}
      </Link>
    </NextLink>
  );
};

export default LinkTopic;
