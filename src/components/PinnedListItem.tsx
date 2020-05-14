/* eslint-disable jsx-a11y/anchor-has-content */
import { Post } from '@zoonk/models';
import NextLink from 'next/link';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  makeStyles,
  Typography,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: { height: '100%' },
  media: {
    height: '5em',
    [theme.breakpoints.up('sm')]: {
      height: '7em',
    },
  },
}));

interface PinnedListItemProps {
  groupImg?: string | null;
  item: Post.Summary;
}

const PinnedListItem = ({ groupImg, item }: PinnedListItemProps) => {
  const classes = useStyles();
  const { cover, id, title } = item;
  const image = cover || groupImg;

  return (
    <Card variant="outlined" className={classes.root}>
      <NextLink href="/posts/[id]" as={`/posts/${id}`} passHref>
        <CardActionArea component="a">
          {image && (
            <CardMedia className={classes.media} image={image} title={title} />
          )}
          <CardContent>
            <Typography variant="h6" component="h2">
              {title}
            </Typography>
          </CardContent>
        </CardActionArea>
      </NextLink>
    </Card>
  );
};

export default PinnedListItem;
