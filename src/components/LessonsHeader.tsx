import NextLink from 'next/link';
import { Button, Typography } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { theme } from '@zoonk/utils';
import useTranslation from './useTranslation';

interface CategoryCardHeaderProps {
  category: 'examples' | 'lessons';
  chapterId: string;
}

const LessonsHeader = ({ category, chapterId }: CategoryCardHeaderProps) => {
  const translate = useTranslation();

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Typography variant="h5" component="h2">
        {translate(category)}
      </Typography>
      <div style={{ flexGrow: 1 }} />
      <NextLink
        href={`/posts/add?category=${category}&chapterId=${chapterId}`}
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
        href={`/chapters/[id]/${category}`}
        as={`/chapters/${chapterId}/${category}`}
        passHref
      >
        <Button component="a" size="small" color="secondary">
          {translate('reorder')}
        </Button>
      </NextLink>
    </div>
  );
};

export default LessonsHeader;
