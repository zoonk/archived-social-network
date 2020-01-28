import { Card, CardContent, CardMedia, Typography } from '@material-ui/core';
import { Chapter } from '@zoonk/models';
import ItemActions from './ItemActions';

interface ChapterDetailsProps {
  data: Chapter.Get;
}

/**
 * Card containing details about a chapter.
 */
const ChapterDetails = ({ data }: ChapterDetailsProps) => {
  const { description, id, likes, photo, title } = data;
  const descriptionWithLineBreak = description.split('\n').filter(Boolean);

  return (
    <Card variant="outlined">
      {photo && (
        <CardMedia style={{ height: 250 }} image={photo} title={title} />
      )}

      <CardContent>
        <Typography variant="h5" component="h2">
          {title}
        </Typography>

        <ItemActions category="chapters" id={id} likes={likes} title={title} />

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
