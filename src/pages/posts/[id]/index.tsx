import { useEffect } from 'react';
import { NextPage } from 'next';
import { Container, Divider, makeStyles } from '@material-ui/core';
import CommentList from '@zoonk/components/CommentList';
import LinkList from '@zoonk/components/LinkList';
import Meta from '@zoonk/components/Meta';
import PostBar from '@zoonk/components/PostBar';
import PostFooter from '@zoonk/components/PostFooter';
import PostHeader from '@zoonk/components/PostHeader';
import Viewer from '@zoonk/components/rich-text/Viewer';
import useAuth from '@zoonk/components/useAuth';
import { Post } from '@zoonk/models';
import { getPost, markPostAsRead, togglePostProgress } from '@zoonk/services';
import {
  analytics,
  appLanguage,
  getPostImage,
  getPlainText,
  PostContext,
  preRender,
} from '@zoonk/utils';

interface PostPageProps {
  data: Post.Get;
}

const useStyles = makeStyles((theme) => ({
  root: { marginBottom: '89px' },
  container: {
    [theme.breakpoints.only('sm')]: {
      padding: theme.spacing(0, 4),
    },
  },
}));

const PostPage: NextPage<PostPageProps> = ({ data }) => {
  const { user } = useAuth();
  const classes = useStyles();
  const { category, chapterId, cover, html, id, language, sites, title } = data;
  const siteImg = sites.find((site) => Boolean(site.image));
  const image = cover || getPostImage(html) || siteImg?.image;

  useEffect(() => {
    analytics().setCurrentScreen('posts_view');
  }, []);

  // Mark a post as read when the page is loaded.
  useEffect(() => {
    if (user) {
      markPostAsRead(id, user.uid);
    }
  }, [id, user]);

  /**
   * Save the user progress for this chapter.
   */
  useEffect(() => {
    if (
      user &&
      chapterId &&
      (category === 'examples' || category === 'lessons')
    ) {
      togglePostProgress(id, chapterId, category, false, user.uid);
    }
  }, [category, chapterId, id, user]);

  return (
    <PostContext.Provider value={{ ...data }}>
      <main className={classes.root}>
        <Meta
          title={title}
          description={getPlainText(html).slice(0, 200)}
          canonicalUrl={`https://${language}.zoonk.org/posts/${id}`}
          image={image}
          noIndex={language !== appLanguage}
        />
        <PostHeader />
        <Container maxWidth="md" className={classes.container}>
          <Viewer html={html} />
          <LinkList sites={sites} />
          <PostFooter id={id} />
          <Divider />
          <CommentList />
        </Container>
        <PostBar />
      </main>
    </PostContext.Provider>
  );
};

PostPage.getInitialProps = async ({ query }) => {
  const postId = String(query.id);
  const data = await getPost(postId);
  preRender();
  return { data };
};

export default PostPage;
