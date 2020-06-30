import { Fragment } from 'react';
import dynamic from 'next/dynamic';
import { List } from '@material-ui/core';
import { Chapter, UserProgress } from '@zoonk/models';
import { getChapterStatus } from '@zoonk/utils';
import ChapterListItem from './ChapterListItem';

const NoChapters = dynamic(() => import('./NoChapters'));

interface ChapterListProps {
  items: Chapter.Summary[];
  progress?: UserProgress.Topic;
}

const ChapterList = ({ items, progress }: ChapterListProps) => {
  if (items.length === 0) {
    return <NoChapters />;
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
            status={getChapterStatus(item, progress?.chapters)}
          />
        ))}
      </List>
    </Fragment>
  );
};

export default ChapterList;
