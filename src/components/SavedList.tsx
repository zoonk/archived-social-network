import { useContext, useEffect } from 'react';
import NextLink from 'next/link';
import { Button, List, ListItem, ListItemText } from '@material-ui/core';
import { SavedItem } from '@zoonk/models';
import { listSavedItems } from '@zoonk/services';
import { GlobalContext, theme } from '@zoonk/utils';
import ListSkeleton from './ListSkeleton';
import SavedNoItems from './SavedNoItems';
import useLoadMore from './useLoadMore';

/**
 * Display a list of saved items.
 */
const SavedList = () => {
  const { translate, user } = useContext(GlobalContext);
  const { get, items, lastVisible, loading } = useLoadMore<
    SavedItem.Snapshot
  >();

  useEffect(() => {
    if (!user) return;
    get(listSavedItems(user.uid, undefined));
  }, [get, user]);

  if (!user) return null;

  const loadMore = () => {
    get(listSavedItems(user.uid, lastVisible));
  };

  if (!loading && items.length === 0) {
    return <SavedNoItems />;
  }

  return (
    <List>
      {items.map((item) => (
        <NextLink
          key={item.id}
          href={`/${item.category}/[id]`}
          as={item.itemPath}
          passHref
        >
          <ListItem button component="a" divider>
            <ListItemText
              primary={item.title}
              secondary={translate(item.category)}
            />
          </ListItem>
        </NextLink>
      ))}

      {loading && <ListSkeleton items={10} />}

      {lastVisible && (
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
    </List>
  );
};

export default SavedList;
