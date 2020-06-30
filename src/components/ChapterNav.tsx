import { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { Button } from '@material-ui/core';
import { ArrowBack, ArrowForward } from '@material-ui/icons';
import { getChapterNavigation } from '@zoonk/services';
import useTranslation from './useTranslation';

interface ChapterNavProps {
  chapterId: string;
  topicId: string;
}

const ChapterNav = ({ chapterId, topicId }: ChapterNavProps) => {
  const translate = useTranslation();
  const [previous, setPrevious] = useState<string | null>(null);
  const [next, setNext] = useState<string | null>(null);

  useEffect(() => {
    getChapterNavigation(chapterId, topicId).then((res) => {
      setPrevious(res.previous);
      setNext(res.next);
    });
  }, [chapterId, topicId]);

  if (!previous && !next) return null;

  return (
    <nav style={{ display: 'flex', alignItems: 'center' }}>
      {previous && (
        <NextLink href="/chapters/[id]" as={`/chapters/${previous}`} passHref>
          <Button
            color="primary"
            variant="outlined"
            startIcon={<ArrowBack style={{ margin: 0 }} />}
            component="a"
          >
            {translate('previous')}
          </Button>
        </NextLink>
      )}
      <div style={{ flexGrow: 1 }} />
      {next && (
        <NextLink href="/chapters/[id]" as={`/chapters/${next}`} passHref>
          <Button
            color="primary"
            variant="outlined"
            endIcon={<ArrowForward style={{ margin: 0 }} />}
            component="a"
          >
            {translate('next')}
          </Button>
        </NextLink>
      )}
    </nav>
  );
};

export default ChapterNav;
