import { Card, CardContent } from '@material-ui/core';
import { Post } from '@zoonk/models';
import LessonList from './LessonList';
import LessonsHeader from './LessonsHeader';
import NoItems from './NoItems';

interface LessonsCardProps {
  category: 'examples' | 'lessons';
  lessons: Post.Summary[];
}

/**
 * Cards for display a list of lessons.
 */
const LessonsCard = ({ category, lessons }: LessonsCardProps) => {
  return (
    <Card variant="outlined">
      <CardContent style={{ paddingBottom: 0 }}>
        <LessonsHeader category={category} />
        {lessons.length === 0 && <NoItems />}
        <LessonList items={lessons} />
      </CardContent>
    </Card>
  );
};

export default LessonsCard;
