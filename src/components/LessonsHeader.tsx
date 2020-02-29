import { useContext } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Button, Typography } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { GlobalContext, theme } from '@zoonk/utils';

interface CategoryCardHeaderProps {
  category: 'examples' | 'lessons';
}

const LessonsHeader = ({ category }: CategoryCardHeaderProps) => {
  const { translate } = useContext(GlobalContext);
  const { query } = useRouter();

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Typography variant="h5" component="h2">
        {translate(category)}
      </Typography>
      <div style={{ flexGrow: 1 }} />
      <NextLink
        href={`/topics/[id]/chapters/[chapterId]/add?category=${category}`}
        as={`/topics/${query.id}/chapters/${query.chapterId}/add?category=${category}`}
        passHref
      >
        <Button component="a" size="small" color="primary">
          <Add
            aria-label={translate('create')}
            style={{ marginRight: theme.spacing(0.5) }}
          />
          {translate('create')}
        </Button>
      </NextLink>
      <NextLink
        href={`/topics/[id]/chapters/[chapterId]/${category}`}
        as={`/topics/${query.id}/chapters/${query.chapterId}/${category}`}
        passHref
      >
        <Button component="a" size="small" color="secondary">
          {translate('edit')}
        </Button>
      </NextLink>
    </div>
  );
};

export default LessonsHeader;
