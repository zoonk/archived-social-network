import { Card, CardContent } from '@material-ui/core';
import { Post } from '@zoonk/models';
import LessonList from './LessonList';
import LessonsHeader from './LessonsHeader';
import NoLessons from './NoLessons';

interface LessonsCardProps {
  category: 'examples' | 'lessons';
  chapterId: string;
  lessons: Post.Summary[];
  topicId: string;
}

/**
 * Cards for display a list of lessons.
 */
const LessonsCard = ({
  category,
  chapterId,
  lessons,
  topicId,
}: LessonsCardProps) => {
  return (
    <Card variant="outlined">
      <CardContent style={{ paddingBottom: 0 }}>
        <LessonsHeader chapterId={chapterId} category={category} />
        {lessons.length === 0 && (
          <NoLessons
            category={category}
            chapterId={chapterId}
            topicId={topicId}
          />
        )}
        <LessonList items={lessons} />
      </CardContent>
    </Card>
  );
};

export default LessonsCard;
