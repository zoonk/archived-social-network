import { Fragment } from 'react';
import { List } from '@material-ui/core';
import { Chapter } from '@zoonk/models';
import ChapterListItem from './ChapterListItem';
import ListSkeleton from './ListSkeleton';
import NoItems from './NoItems';

interface ChapterListProps {
  loading: boolean;
  items: Chapter.Get[];
}

/**
 * Display a list of chapters.
 * @property `items` - list of items.
 * @property `loading` - loading state.
 */
const ChapterList = ({ items, loading }: ChapterListProps) => {
  if (items.length === 0 && !loading) {
    return <NoItems />;
  }

  return (
    <Fragment>
      <List disablePadding>
        {items.map((item, index) => (
          <ChapterListItem
            key={item.id}
            divider={index !== items.length - 1}
            item={item}
          />
        ))}
      </List>

      {loading && <ListSkeleton />}
    </Fragment>
  );
};

export default ChapterList;
