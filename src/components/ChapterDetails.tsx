import { Card, CardContent, Typography } from '@material-ui/core';
import { Chapter } from '@zoonk/models';
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
  const descriptionWithLineBreak = description.split('\n').filter(Boolean);

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
          title={title}
        />

        {descriptionWithLineBreak.map((text, index) => (
          <Typography
            key={text}
            variant="body2"
            color="textSecondary"
            component="p"
            gutterBottom={index !== descriptionWithLineBreak.length - 1}
          >
            {text}
          </Typography>
        ))}
      </CardContent>
    </Card>
  );
};

export default ChapterDetails;
