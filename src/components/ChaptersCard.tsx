import { useEffect, useState } from 'react';
import { Card, CardContent } from '@material-ui/core';
import { Chapter, Topic, UserProgress } from '@zoonk/models';
import { getTopicProgress } from '@zoonk/services';
import ChaptersHeader from './ChaptersHeader';
import ChapterList from './ChapterList';
import ItemProgress from './ItemProgress';
import useAuth from './useAuth';

interface ChaptersCardProps {
  chapters: Chapter.Summary[];
  topic: Topic.Get;
}

const ChaptersCard = ({ chapters, topic }: ChaptersCardProps) => {
  const { user } = useAuth();
  const [userProgress, setProgress] = useState<UserProgress.Topic>();

  useEffect(() => {
    if (user) {
      getTopicProgress(topic, user.uid).then(setProgress);
    }
  }, [topic, user]);

  return (
    <Card variant="outlined">
      <CardContent style={{ paddingBottom: 0 }}>
        <ChaptersHeader />
        <ItemProgress progress={userProgress?.progress || 0} />
        <ChapterList items={chapters} progress={userProgress} />
      </CardContent>
    </Card>
  );
};

export default ChaptersCard;
