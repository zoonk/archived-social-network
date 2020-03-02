import { useContext } from 'react';
import NextLink from 'next/link';
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
} from '@material-ui/core';
import { Topic } from '@zoonk/models';
import { GlobalContext } from '@zoonk/utils';

interface TopicCardProps {
  topic: Topic.Get;
}

const TopicCard = ({ topic }: TopicCardProps) => {
  const { translate } = useContext(GlobalContext);
  const { title, id, photo } = topic;

  return (
    <Card variant="outlined" style={{ height: '100%' }}>
      <NextLink href="/topics/[id]" as={`/topics/${id}`} passHref>
        <CardActionArea component="a">
          {photo && (
            <CardMedia style={{ height: 140 }} image={photo} title={title} />
          )}
          <CardContent>
            <Typography variant="h5" component="h2">
              {title}
            </Typography>
          </CardContent>
        </CardActionArea>
      </NextLink>
      <CardActions>
        <NextLink href="/topics/[id]" as={`/topics/${id}`} passHref>
          <Button component="a" size="small" color="primary">
            {translate('learn')}
          </Button>
        </NextLink>
        <NextLink href="/topics/[id]/teach" as={`/topics/${id}/teach`} passHref>
          <Button component="a" size="small" color="primary">
            {translate('teach')}
          </Button>
        </NextLink>
      </CardActions>
    </Card>
  );
};

export default TopicCard;
