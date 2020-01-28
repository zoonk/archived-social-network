import { useContext, useEffect, useState } from 'react';
import NextLink from 'next/link';
import { Card, CardContent, IconButton, Typography } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { Chapter, SnackbarAction } from '@zoonk/models';
import { listChapters } from '@zoonk/services';
import { firebaseError, GlobalContext } from '@zoonk/utils';
import ChapterList from './ChapterList';
import Snackbar from './Snackbar';

interface ChaptersCardProps {
  pathId: string;
}

/**
 * Card containing a list of chapters.
 * @property `pathId` - learningPath ID.
 */
const ChaptersCard = ({ pathId }: ChaptersCardProps) => {
  const { translate } = useContext(GlobalContext);
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [items, setItems] = useState<Chapter.Get[]>([]);

  useEffect(() => {
    let active = true;

    setLoading(true);
    listChapters(pathId)
      .then((res) => {
        if (active) {
          setLoading(false);
          setItems(res);
        }
      })
      .catch((e) => {
        setSnackbar(firebaseError(e, 'chapter_list'));
      });

    return () => {
      active = false;
    };
  }, [pathId]);

  return (
    <Card variant="outlined">
      <CardContent style={{ paddingBottom: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h5" component="h2">
            {translate('chapters')}
          </Typography>

          <div style={{ flexGrow: 1 }} />

          <NextLink
            href={{
              pathname: '/chapters/add',
              query: { pathId, order: items.length },
            }}
            passHref
          >
            <IconButton component="a" size="small" color="primary">
              <Add />
            </IconButton>
          </NextLink>
        </div>

        <ChapterList items={items} loading={loading} />
        <Snackbar action={snackbar} />
      </CardContent>
    </Card>
  );
};

export default ChaptersCard;
