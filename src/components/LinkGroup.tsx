import NextLink from 'next/link';
import { Link } from '@material-ui/core';
import useTranslation from './useTranslation';

interface LinkGroupProps {
  id: string;
  title?: string;
}

const LinkGroup = ({ id, title }: LinkGroupProps) => {
  const translate = useTranslation();
  const groupTitle = title || translate('group');

  return (
    <NextLink href="/groups/[id]" as={`/groups/${id}`} passHref>
      <Link color="inherit" title={groupTitle}>
        {groupTitle}
      </Link>
    </NextLink>
  );
};

export default LinkGroup;
