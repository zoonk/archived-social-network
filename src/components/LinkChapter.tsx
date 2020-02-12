import { useContext } from 'react';
import NextLink from 'next/link';
import { Link } from '@material-ui/core';
import { GlobalContext } from '@zoonk/utils';

interface LinkChapterProps {
  id: string;
  title?: string;
}

/**
 * Default link to a single chapter.
 */
const LinkChapter = ({ id, title }: LinkChapterProps) => {
  const { translate } = useContext(GlobalContext);
  const name = title || translate('chapter');

  return (
    <NextLink href="/chapters/[id]" as={`/chapters/${id}`} passHref>
      <Link color="inherit" title={name}>
        {name}
      </Link>
    </NextLink>
  );
};

export default LinkChapter;
