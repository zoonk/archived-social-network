import { Card, CardContent, Typography } from '@material-ui/core';
import { Chapter } from '@zoonk/models';
import EditorView from './EditorView';
import ItemActions from './ItemActions';

interface ChapterDetailsProps {
  data: Chapter.Get;
  topicId: string;
}

/**
 * Card containing details about a chapter.
 */
const ChapterDetails = ({ data, topicId }: ChapterDetailsProps) => {
  const { description, id, likes, title } = data;

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h5" component="h2">
          {title}
        </Typography>

        <ItemActions
          category="chapters"
          id={id}
          likes={likes}
          href="/topics/[id]/chapters/[chapterId]"
          linkAs={`/topics/${topicId}/chapters/${data.id}`}
        />

        <EditorView content={description} />
      </CardContent>
    </Card>
  );
};

export default ChapterDetails;
