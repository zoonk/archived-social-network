import { Card, CardContent, Typography } from '@material-ui/core';
import { Chapter } from '@zoonk/models';
import EditorView from './EditorView';
import ItemActionsMenu from './ItemActionsMenu';

interface ChapterDetailsProps {
  data: Chapter.Get;
}

/**
 * Card containing details about a chapter.
 */
const ChapterDetails = ({ data }: ChapterDetailsProps) => {
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
        <EditorView content={description} />
      </CardContent>
    </Card>
  );
};

export default ChapterDetails;
