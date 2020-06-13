import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Link, Typography } from '@material-ui/core';
import { getPageTitle, theme } from '@zoonk/utils';
import useTranslation from './useTranslation';

const NoChapters = () => {
  const translate = useTranslation();
  const { query } = useRouter();
  const id = String(query.id);
  const title = getPageTitle(id);

  return (
    <div style={{ margin: theme.spacing(2, 0) }}>
      <Typography variant="body2" color="textSecondary">
        {translate('no_chapters', { title })}{' '}
        <NextLink href={`/chapters/add?topicId=${id}`} passHref>
          <Link>{translate('chapter_first')}</Link>
        </NextLink>
        .
      </Typography>
    </div>
  );
};

export default NoChapters;
