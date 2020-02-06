import { useContext, useEffect, useState } from 'react';
import { Card, CardContent } from '@material-ui/core';
import { Chapter, SnackbarAction } from '@zoonk/models';
import { listChapters } from '@zoonk/services';
import { firebaseError, GlobalContext } from '@zoonk/utils';
import CategoryCardHeader from './CategoryCardHeader';
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
        <CategoryCardHeader
          canAdd
          edit="chapters"
          hideLink
          query={{ pathId, order: items.length + 1 }}
          category="chapters"
          title={translate('chapters')}
        />
        <ChapterList items={items} loading={loading} />
        <Snackbar action={snackbar} />
      </CardContent>
    </Card>
  );
};

export default ChaptersCard;
