import { useContext } from 'react';
import NextLink from 'next/link';
import { Link } from '@material-ui/core';
import { getPageTitle, GlobalContext } from '@zoonk/utils';

interface LinkTopicProps {
  id: string;
}

/**
 * Default link to a topic page.
 */
const LinkTopic = ({ id }: LinkTopicProps) => {
  const { translate } = useContext(GlobalContext);
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
