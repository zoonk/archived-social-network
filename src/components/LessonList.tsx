import { List } from '@material-ui/core';
import { Post } from '@zoonk/models';
import LessonListItem from './LessonListItem';

interface LessonListProps {
  items: Post.Summary[];
}

/**
 * Display a list of lessons.
 */
const LessonList = ({ items }: LessonListProps) => {
  return (
    <List disablePadding>
      {items.map((item, index) => (
        <LessonListItem
          key={item.id}
          divider={index !== items.length - 1}
          index={index}
          item={item}
        />
      ))}
    </List>
  );
};

export default LessonList;
