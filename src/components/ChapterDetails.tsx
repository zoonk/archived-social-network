import { Card, CardContent, Typography } from '@material-ui/core';
import { Chapter } from '@zoonk/models';
import ItemActionsMenu from './ItemActionsMenu';
import ItemProgress from './ItemProgress';

interface ChapterDetailsProps {
  completed: number;
  data: Chapter.Get;
}

const ChapterDetails = ({ completed, data }: ChapterDetailsProps) => {
  const { description, title } = data;

  return (
    <Card variant="outlined">
      <CardContent>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h5" component="h2">
            {title}
          </Typography>
          <ItemActionsMenu />
        </div>
        <ItemProgress progress={completed} />
        <Typography variant="body1" gutterBottom>
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ChapterDetails;
