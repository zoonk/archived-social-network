/* eslint-disable jsx-a11y/anchor-has-content */
import { Post } from '@zoonk/models';
import NextLink from 'next/link';
import {
  Card,
  CardContent,
  Link,
  makeStyles,
  Typography,
} from '@material-ui/core';
import {
  getDomainFromUrl,
  getPostImage,
  isInternal,
  markdownToText,
} from '@zoonk/utils';
import PostListMeta from './PostListMeta';

const useStyles = makeStyles((theme) => ({
  content: {
    '&:last-child': {
      paddingBottom: 16,
    },
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
  link: { marginRight: theme.spacing(1) },
}));

interface PostListItemProps {
  item: Post.Get;
}

const PostListItem = ({ item }: PostListItemProps) => {
  const classes = useStyles();
  const { content, cover, id, sites, title } = item;
  const siteImg = sites.find((site) => Boolean(site.image));
  const image = cover || getPostImage(content) || siteImg?.image;

  return (
    <Card variant="outlined">
      <CardContent style={{ display: 'flex' }} className={classes.content}>
        {image && (
          <NextLink href="/posts/[id]" as={`/posts/${id}`} passHref>
            <a
              className={classes.image}
              style={{
                background: `url(${image}) no-repeat center center`,
                backgroundSize: 'cover',
              }}
            />
          </NextLink>
        )}

        <div style={{ minWidth: 0 }}>
          <NextLink href="/posts/[id]" as={`/posts/${id}`} passHref>
            <Link color="textPrimary">
              <Typography gutterBottom={sites.length === 0} variant="h6" noWrap>
                {title}
              </Typography>
            </Link>
          </NextLink>

          {sites.slice(0, 3).map(({ url }) => (
            <Link
              key={url}
              href={url}
              target={isInternal(url) ? '_self' : '_blank'}
              rel={isInternal(url) ? undefined : 'noopener noreferrer'}
              className={classes.link}
            >
              {getDomainFromUrl(url)}
            </Link>
          ))}

          <Typography variant="body2" gutterBottom>
            {markdownToText(content).slice(0, 200)}
          </Typography>

          <PostListMeta post={item} />
        </div>
      </CardContent>
    </Card>
  );
};

export default PostListItem;
