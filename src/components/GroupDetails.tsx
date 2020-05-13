import { Card, CardContent, CardMedia, Typography } from '@material-ui/core';
import { Group } from '@zoonk/models';
import EditorView from './EditorView';
import ItemActionsMenu from './ItemActionsMenu';

interface GroupDetailsProps {
  group: Group.Get;
}

const GroupDetails = ({ group }: GroupDetailsProps) => {
  const { description, photo, title } = group;

  return (
    <Card variant="outlined">
      {photo && (
        <CardMedia style={{ height: 250 }} image={photo} title={title} />
      )}

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

export default GroupDetails;
