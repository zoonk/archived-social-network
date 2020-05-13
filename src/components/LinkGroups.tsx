import { useContext } from 'react';
import NextLink from 'next/link';
import { Link } from '@material-ui/core';
import { GlobalContext, getPageTitle } from '@zoonk/utils';

interface LinkGroupsProps {
  topicId?: string;
}

const LinkGroups = ({ topicId }: LinkGroupsProps) => {
  const { translate } = useContext(GlobalContext);
  const title = topicId
    ? translate('groups_about', { title: getPageTitle(topicId) })
    : translate('groups');
  const href = topicId ? '/topics/[id]/groups' : '/groups';
  const as = topicId ? `/topics/${topicId}/groups` : '/groups';

  return (
    <NextLink href={href} as={as} passHref>
      <Link color="inherit" title={title}>
        {translate('groups')}
      </Link>
    </NextLink>
  );
};

export default LinkGroups;
