import { Card, CardContent } from '@material-ui/core';
import { ChapterProgress, Post } from '@zoonk/models';
import LessonList from './LessonList';
import LessonsHeader from './LessonsHeader';
import NoLessons from './NoLessons';

interface LessonsCardProps {
  category: 'examples' | 'lessons';
  chapterId: string;
  lessons: Post.Summary[];
  progress?: ChapterProgress.Response;
  topicId: string;
}

const LessonsCard = ({
  category,
  chapterId,
  lessons,
  progress,
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
        <LessonList category={category} items={lessons} progress={progress} />
      </CardContent>
    </Card>
  );
};

export default LessonsCard;
