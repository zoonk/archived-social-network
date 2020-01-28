import { useContext } from 'react';
import {
  Card,
  CardContent,
  Chip,
  CardMedia,
  Typography,
} from '@material-ui/core';
import { Path } from '@zoonk/models';
import { GlobalContext, theme } from '@zoonk/utils';
import ItemActions from './ItemActions';
import TopicChips from './TopicChips';

interface PathDetailsProps {
  data: Path.Get;
}

/**
 * Card containing details about a learning path.
 */
const PathDetails = ({ data }: PathDetailsProps) => {
  const { translate } = useContext(GlobalContext);
  const { description, id, level, likes, photo, title } = data;
  const descriptionWithLineBreak = description.split('\n').filter(Boolean);

  return (
    <Card variant="outlined">
      {photo && (
        <CardMedia style={{ height: 250 }} image={photo} title={title} />
      )}

      <CardContent style={{ paddingBottom: 0 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h5" component="h2">
            {title}
          </Typography>
          <Chip
            size="small"
            variant="outlined"
            color="primary"
            label={translate(level)}
            style={{ marginLeft: theme.spacing(1) }}
          />
        </div>

        <ItemActions category="paths" id={id} likes={likes} title={title} />

        {descriptionWithLineBreak.map((text) => (
          <Typography
            key={text}
            variant="body2"
            color="textSecondary"
            component="p"
            gutterBottom
          >
            {text}
          </Typography>
        ))}

        <TopicChips items={data.topics} />
      </CardContent>
    </Card>
  );
};

export default PathDetails;
