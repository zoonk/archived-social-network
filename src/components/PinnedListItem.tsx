/* eslint-disable jsx-a11y/anchor-has-content */
import { Post } from '@zoonk/models';
import NextLink from 'next/link';
import { Link, makeStyles, Paper, Typography } from '@material-ui/core';
import { markdownToText } from '@zoonk/utils';

const useStyles = makeStyles((theme) => ({
  content: {
    display: 'flex',
    padding: theme.spacing(1),
  },
  image: {
    width: '100px',
    minWidth: '100px',
    marginRight: theme.spacing(1),
    [theme.breakpoints.down('xs')]: {
      width: '40px',
      minWidth: '40px',
      maxHeight: '40px',
    },
  },
}));

interface PinnedListItemProps {
  item: Post.Summary;
}

const PinnedListItem = ({ item }: PinnedListItemProps) => {
  const classes = useStyles();
  const { cover, description, id, title } = item;

  return (
    <Paper variant="outlined">
      <div className={classes.content}>
        {cover && (
          <NextLink href="/posts/[id]" as={`/posts/${id}`} passHref>
            <a
              className={classes.image}
              style={{
                background: `url(${cover}) no-repeat center center`,
                backgroundSize: 'cover',
              }}
            />
          </NextLink>
        )}

        <div style={{ minWidth: 0 }}>
          <NextLink href="/posts/[id]" as={`/posts/${id}`} passHref>
            <Link color="textPrimary">
              <Typography gutterBottom variant="h6" noWrap>
                {title}
              </Typography>
            </Link>
          </NextLink>

          <Typography variant="body2" gutterBottom>
            {markdownToText(description).slice(0, 200)}
          </Typography>
        </div>
      </div>
    </Paper>
  );
};

export default PinnedListItem;
