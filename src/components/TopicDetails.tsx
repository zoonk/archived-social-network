import { useContext } from 'react';
import NextLink from 'next/link';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from '@material-ui/core';
import { Topic } from '@zoonk/models';
import { GlobalContext } from '@zoonk/utils';
import TopicActions from './TopicActions';

interface TopicDetailsProps {
  topic: Topic.Get;
}

/**
 * Card containing details about a topic.
 */
const TopicDetails = ({ topic }: TopicDetailsProps) => {
  const { translate } = useContext(GlobalContext);
  const { description, id, language, likes, photo, title } = topic;
  const descriptionWithLineBreak = description.split('\n').filter(Boolean);
  const wikiId = id.slice(0, id.length - 3);

  return (
    <Card variant="outlined">
      {photo && (
        <CardMedia style={{ height: 250 }} image={photo} title={title} />
      )}

      <CardContent>
        <Typography variant="h5" component="h2">
          {title}
        </Typography>

        <TopicActions id={id} likes={likes} />

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

      <CardActions>
        <Button
          component="a"
          size="small"
          color="primary"
          href={`https://${language}.wikipedia.org/wiki/${wikiId}`}
        >
          {translate('read_wikipedia')}
        </Button>
        <NextLink href="/topics/[id]/teach" as={`/topics/${id}/teach`} passHref>
          <Button component="a" size="small" color="primary">
            {translate('teach')}
          </Button>
        </NextLink>
      </CardActions>
    </Card>
  );
};

export default TopicDetails;
