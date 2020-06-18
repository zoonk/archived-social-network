import { useEffect } from 'react';
import { NextPage } from 'next';
import Error from 'next/error';
import { Container, Divider, makeStyles } from '@material-ui/core';
import CommentList from '@zoonk/components/CommentList';
import LinkList from '@zoonk/components/LinkList';
import Meta from '@zoonk/components/Meta';
import PostBar from '@zoonk/components/PostBar';
import PostFooter from '@zoonk/components/PostFooter';
import PostHeader from '@zoonk/components/PostHeader';
import EditorRead from '@zoonk/components/rich-text/EditorRead';
import { getPlainText, getPostImage } from '@zoonk/components/rich-text/posts';
import useAuth from '@zoonk/components/useAuth';
import { Post } from '@zoonk/models';
import { getPost, markPostAsRead, togglePostProgress } from '@zoonk/services';
import { appLanguage, PostContext, preRender } from '@zoonk/utils';

interface PostPageProps {
  data: Post.Get | null;
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

  // Mark a post as read when the page is loaded.
  useEffect(() => {
    if (user && data) {
      markPostAsRead(data.id, user.uid);
    }
  }, [data, user]);

  /**
   * Save the user progress for this chapter.
   */
  useEffect(() => {
    if (
      user &&
      data &&
      data.chapterId &&
      (data.category === 'examples' || data.category === 'lessons')
    ) {
      togglePostProgress(
        data.id,
        data.chapterId,
        data.category,
        false,
        user.uid,
      );
    }
  }, [data, user]);

  if (!data) return <Error statusCode={404} />;

  const { content, cover, id, language, sites, title } = data;
  const siteImg = sites.find((site) => Boolean(site.image));
  const image = cover || getPostImage(content) || siteImg?.image;

  return (
    <PostContext.Provider value={{ ...data }}>
      <main className={classes.root}>
        <Meta
          title={title}
          description={getPlainText(content).slice(0, 200)}
          canonicalUrl={`https://${language}.zoonk.org/posts/${id}`}
          image={image}
          noIndex={language !== appLanguage}
        />
        <PostHeader />
        <Container maxWidth="md" className={classes.container}>
          <EditorRead content={content} />
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
