import { Card, CardContent } from '@material-ui/core';
import { Chapter } from '@zoonk/models';
import ChaptersHeader from './ChaptersHeader';
import ChapterList from './ChapterList';

interface ChaptersCardProps {
  chapters: Chapter.Summary[];
}

/**
 * Card containing a list of chapters.
 */
const ChaptersCard = ({ chapters }: ChaptersCardProps) => {
  return (
    <Card variant="outlined">
      <CardContent style={{ paddingBottom: 0 }}>
        <ChaptersHeader />
        <ChapterList items={chapters} />
      </CardContent>
    </Card>
  );
};

export default ChaptersCard;
