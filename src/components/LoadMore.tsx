import { Fragment, useEffect, useState } from 'react';
import { Button, CircularProgress } from '@material-ui/core';
import { db } from '@zoonk/firebase/db';
import { theme } from '@zoonk/utils';
import useSnackbar from './useSnackbar';
import useTranslation from './useTranslation';

/**
 * Make sure this function returns a snapshot as it's required
 * to make Firebase's pagination work.
 */
type DocWithSnapshot<T> = T & {
  snap: firebase.firestore.DocumentSnapshot;
};

interface LoadMoreProps<T> {
  /**
   * Doc path from the last item. This is used to get the document snapshot.
   * E.g. `posts/postId`
   */
  lastPath: string | firebase.firestore.DocumentSnapshot;

  /**
   * Current list size. We use this value to check if the load more button
   * should be displayed.
   */
  length: number;

  /**
   * Maximum number of items to display. This is also used to check if the "load more"
   * button should be displayed.
   */
  limit: number;

  /**
   * Request to get more items. We're passing the last item snapshot as an argument.
   */
  request: (
    lastItem: firebase.firestore.DocumentSnapshot,
  ) => Promise<DocWithSnapshot<T>[]>;

  /**
   * Callback for updating the items array. It display only the new items for the next page.
   * If you need to keep the previous items in the list, you'll have to merge both arrays.
   * E.g. `onLoadMore={(newData) => setState([...oldData, ...newData])}`
   */
  onLoadMore: (items: DocWithSnapshot<T>[]) => void;
}

/**
 * Reusable component for a "load more" button using Firebase pagination.
 */
function LoadMore<T>({
  lastPath,
  length,
  limit,
  request,
  onLoadMore,
}: LoadMoreProps<T>) {
  const translate = useTranslation();
  const { snackbar } = useSnackbar();
  const [loading, setLoading] = useState<boolean>(false);
  const [lastItem, setLastItem] = useState<
    firebase.firestore.DocumentSnapshot
  >();

  // Don't display a load more button when there are no items left to display.
  const shouldLoadMore = length > 0 && length % limit === 0;

  /**
   * Firebase doesn't allow pagination by querying using a document's ID.
   * They require to pass a document snapshot. As we're server-rendering
   * this list, we don't have the document snapshot. So, we're requesting it
   * during the first load to allow pagination.
   * https://github.com/firebase/firebase-js-sdk/issues/3238
   */
  useEffect(() => {
    // When the lastPath is a document snapshot, then we don't need get it.
    if (typeof lastPath !== 'string') {
      setLastItem(lastPath);
      return;
    }

    db.doc(lastPath)
      .get()
      .then(setLastItem);
  }, [lastPath]);

  const loadMore = () => {
    if (!lastItem) return;
    setLoading(true);

    // Get the new items.
    request(lastItem)
      .then((res) => {
        const last = res[res.length - 1];
        setLoading(false);

        // Dispatch callback for updating items.
        onLoadMore(res);

        // Update the last item reference for pagination.
        setLastItem(last.snap);
      })
      .catch((e) => snackbar('error', e.message));
  };

  return (
    <Fragment>
      {loading && <CircularProgress />}
      {shouldLoadMore && lastItem && (
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={loadMore}
          style={{ margin: theme.spacing(3, 0, 2) }}
        >
          {translate('load_more')}
        </Button>
      )}
    </Fragment>
  );
}

export default LoadMore;
