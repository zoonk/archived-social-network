import NextLink from 'next/link';
import { Link } from '@material-ui/core';
import { getPageTitle } from '@zoonk/utils';
import useTranslation from './useTranslation';

interface LinkGroupsProps {
  topicId?: string;
}

const LinkGroups = ({ topicId }: LinkGroupsProps) => {
  const translate = useTranslation();
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
