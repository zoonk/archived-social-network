import { List } from '@material-ui/core';
import { ChapterProgress, Post } from '@zoonk/models';
import { getLessonStatus } from '@zoonk/utils';
import LessonListItem from './LessonListItem';

interface LessonListProps {
  category: keyof ChapterProgress.Response;
  items: Post.Summary[];
  progress?: ChapterProgress.Response;
}

const LessonList = ({ category, items, progress }: LessonListProps) => {
  return (
    <List disablePadding>
      {items.map((item, index) => (
        <LessonListItem
          key={item.id}
          divider={index !== items.length - 1}
          index={index}
          item={item}
          status={getLessonStatus(category, item.id, progress)}
        />
      ))}
    </List>
  );
};

export default LessonList;
