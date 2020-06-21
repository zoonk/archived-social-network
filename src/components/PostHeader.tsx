import { useContext } from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import { Post } from '@zoonk/models';
import { PostContext } from '@zoonk/utils';
import PostsBreadcrumb from './PostsBreadcrumb';
import PostCredits from './PostCredits';
import PostLinks from './PostLinks';
import PostTitle from './PostTitle';
import PostTopics from './PostTopics';
import { getPostImage } from './rich-text/posts';

const useStyles = makeStyles((theme) => ({
  root: {
    borderBottom: `1px dashed ${theme.palette.primary.light}`,
    padding: 0,
    minHeight: 'calc(100vh - 48px - 69px)',
    '-webkit-font-smoothing': 'antialiased',
    [theme.breakpoints.up('md')]: {
      paddingBottom: 0,
    },
  },
  container: {
    minHeight: 'calc(100vh - 48px - 70px)',
  },
  cover: ({ cover }: Partial<Post.Get>) => ({
    background: `url(${cover})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '50vh',
    [theme.breakpoints.up('sm')]: {
      height: '70vh',
    },
    [theme.breakpoints.up('md')]: {
      minHeight: 'calc(100vh - 48px - 70px)',
    },
  }),
  titleGrid: ({ cover }: Partial<Post.Get>) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: cover ? 'flex-start' : 'center',
    justifyContent: 'center',
    padding: theme.spacing(2),
    height: cover ? 'auto' : 'calc(100vh - 48px - 70px)',
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(2, 4),
    },
    [theme.breakpoints.up('md')]: {
      minHeight: 'calc(100vh - 48px - 70px)',
      alignItems: 'center',
      padding: cover ? theme.spacing(0, 4) : theme.spacing(8),
    },
  }),
  link: { marginTop: theme.spacing(-3), marginBottom: theme.spacing(2) },
}));

const PostHeader = () => {
  const {
    chapterData,
    chapterId,
    createdAt,
    createdBy,
    content,
    cover,
    editors,
    groupId,
    groupData,
    sites,
    subtitle,
    title,
    topics,
    updatedAt,
  } = useContext(PostContext);
  const siteImg = sites.find((site) => Boolean(site.image));
  const image = cover || getPostImage(content) || siteImg?.image;
  const classes = useStyles({ cover: image });

  return (
    <header className={classes.root}>
      <Grid container className={classes.container}>
        {image && <Grid item xs={12} md={6} className={classes.cover} />}
        <Grid item xs={12} md={image ? 6 : 12} className={classes.titleGrid}>
          <div>
            <PostsBreadcrumb
              chapterId={chapterId}
              chapterName={chapterData?.title}
              groupId={groupId}
              groupName={groupData?.title}
              topicId={topics[0]}
            />
            <PostTitle title={title} subtitle={subtitle} />
            <PostTopics topics={topics} />
            <PostLinks links={sites} />
            <PostCredits
              author={createdBy}
              editors={editors}
              createdAt={createdAt}
              updatedAt={updatedAt}
            />
          </div>
        </Grid>
      </Grid>
    </header>
  );
};

export default PostHeader;
