import NextLink from 'next/link';
import { Link } from '@material-ui/core';
import useTranslation from './useTranslation';

interface LinkChapterProps {
  id: string;
  title?: string;
}

const LinkChapter = ({ id, title }: LinkChapterProps) => {
  const translate = useTranslation();
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
