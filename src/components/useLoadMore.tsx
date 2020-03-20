import { useEffect, useRef, useState } from 'react';

/**
 * Make sure this function returns a snapshot.
 */
type DocWithSnapshot<T> = T & {
  snap: firebase.firestore.DocumentSnapshot;
};

interface GetAction<T> {
  data: Promise<DocWithSnapshot<T>[]>;
  replace?: boolean;
}

/**
 * Hook for creating a "load more" style pagination.
 * When a user clicks on "load more", it shows the next items
 * in the collection.
 * @param limit - # of items to be displayed.
 *
 * @returns an object containing the following properties:
 * - `get()` - pass a function to initialize the loading process.
 * - `loading` - display the loading status.
 * - `error` - display a `FirebaseError` object.
 * - `items` - return a list of items from the backend.
 * - `lastVisible` - snapshot from the last item displayed in the list.
 */
function useLoadMore<T>(limit: number = 10) {
  const [getFn, get] = useState<GetAction<T>>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<firebase.FirebaseError>();
  const [state, setState] = useState<T[]>([]);
  const lastVisible = useRef<firebase.firestore.DocumentSnapshot>();

  useEffect(() => {
    let active = true;

    /**
     * When we set the `replace` property to `true`, we need to reload all items.
     * Hence, we set the state to an empty array to have a better loading effect.
     */
    if (getFn && getFn.replace) {
      setState([]);
    }

    // Only run this effect when the `getFn()` is called from the component.
    if (getFn && getFn.data) {
      setLoading(true);

      getFn.data
        .then((docs) => {
          if (active) {
            // If the length is lower than the limit, then there are no more items to show.
            const hasMoreItems = docs.length === limit;
            const lastDoc = docs[docs.length - 1];

            // If we have more items, then we should update the `lastVisible` reference.
            // This is necessary so that the component knows where to start the next query
            // when trying to retrieve more items from the backend.
            lastVisible.current = hasMoreItems ? lastDoc.snap : undefined;

            /**
             * When the `getFn.replace` property is set to `true`, then replace all data.
             * Otherwise, merge with the previous data (for pagination).
             */
            setState((previous) => {
              const data = getFn.replace ? docs : [...previous, ...docs];
              return data;
            });
            setLoading(false);
          }
        })
        .catch((err) => {
          if (active) {
            setLoading(false);
            setError(err);
          }
        });
    }

    return () => {
      active = false;
    };
  }, [getFn, limit]);

  return {
    error,
    get,
    items: state,
    lastVisible: lastVisible.current,
    loading,
  };
}

export default useLoadMore;
