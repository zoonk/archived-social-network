import { Card, CardContent } from '@material-ui/core';
import { Chapter, Topic } from '@zoonk/models';
import ChaptersHeader from './ChaptersHeader';
import ChapterList from './ChapterList';
import TopicProgress from './TopicProgress';

interface ChaptersCardProps {
  chapters: Chapter.Summary[];
  topic: Topic.Get;
}

const ChaptersCard = ({ chapters, topic }: ChaptersCardProps) => {
  return (
    <Card variant="outlined">
      <CardContent style={{ paddingBottom: 0 }}>
        <ChaptersHeader />
        <TopicProgress topic={topic} />
        <ChapterList items={chapters} />
      </CardContent>
    </Card>
  );
};

export default ChaptersCard;
