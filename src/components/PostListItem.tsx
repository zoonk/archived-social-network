/* eslint-disable jsx-a11y/anchor-has-content */
import { Post } from '@zoonk/models';
import NextLink from 'next/link';
import { Link, makeStyles, Paper, Typography } from '@material-ui/core';
import { getDomainFromUrl, isInternal } from '@zoonk/utils';
import PostListMeta from './PostListMeta';
import { getPlainText, getPostImage } from './rich-text/posts';
import useTranslation from './useTranslation';

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
  linkList: { display: 'flex', flexWrap: 'wrap' },
  link: { marginRight: theme.spacing(1) },
}));

interface PostListItemProps {
  item: Post.Get;
}

const PostListItem = ({ item }: PostListItemProps) => {
  const classes = useStyles();
  const translate = useTranslation();
  const { content, cover, id, sites, title } = item;
  const siteImg = sites.find((site) => Boolean(site.image));
  const image = cover || getPostImage(content) || siteImg?.image;

  return (
    <Paper variant="outlined">
      <div className={classes.content}>
        {image && (
          <NextLink href="/posts/[id]" as={`/posts/${id}`} passHref>
            <a
              className={classes.image}
              aria-label={translate('open_page', { title })}
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

          <div className={classes.linkList}>
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
          </div>

          <Typography variant="body2" gutterBottom>
            {getPlainText(content).slice(0, 200)}
          </Typography>

          <PostListMeta post={item} />
        </div>
      </div>
    </Paper>
  );
};

export default PostListItem;
