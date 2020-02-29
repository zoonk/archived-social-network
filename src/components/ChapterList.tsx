import { Fragment } from 'react';
import { List } from '@material-ui/core';
import { Chapter } from '@zoonk/models';
import ChapterListItem from './ChapterListItem';
import NoItems from './NoItems';

interface ChapterListProps {
  items: Chapter.Summary[];
}

/**
 * Display a list of chapters.
 */
const ChapterList = ({ items }: ChapterListProps) => {
  if (items.length === 0) {
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
            index={index}
          />
        ))}
      </List>
    </Fragment>
  );
};

export default ChapterList;
