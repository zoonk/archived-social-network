import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Button, Typography } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { theme } from '@zoonk/utils';
import useTranslation from './useTranslation';

const ChaptersHeader = () => {
  const translate = useTranslation();
  const { query } = useRouter();

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Typography variant="h5" component="h2">
        {translate('chapters')}
      </Typography>
      <div style={{ flexGrow: 1 }} />
      <NextLink href={`/chapters/add?topicId=${query.id}`} passHref>
        <Button component="a" size="small" color="primary">
          <Add
            aria-label={translate('create')}
            style={{ marginRight: theme.spacing(0.5) }}
          />
          {translate('create')}
        </Button>
      </NextLink>
      <NextLink
        href="/topics/[id]/chapters"
        as={`/topics/${query.id}/chapters`}
        passHref
      >
        <Button component="a" size="small" color="secondary">
          {translate('reorder')}
        </Button>
      </NextLink>
    </div>
  );
};

export default ChaptersHeader;
