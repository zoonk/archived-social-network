import { useContext } from 'react';
import NextLink from 'next/link';
import { Link } from '@material-ui/core';
import { GlobalContext } from '@zoonk/utils';

interface LinkChapterProps {
  chapterId: string;
  title?: string;
}

/**
 * Default link to a single chapter.
 */
const LinkChapter = ({ chapterId, title }: LinkChapterProps) => {
  const { translate } = useContext(GlobalContext);
  const name = title || translate('chapter');

  return (
    <NextLink href="/chapters/[id]" as={`/chapters/${chapterId}`} passHref>
      <Link color="inherit" title={name}>
        {name}
      </Link>
    </NextLink>
  );
};

export default LinkChapter;
