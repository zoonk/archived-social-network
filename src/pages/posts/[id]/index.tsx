import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import NextLink from 'next/link';
import { Button, Container, Grid, Hidden } from '@material-ui/core';
import ItemCredits from '@zoonk/components/ItemCredits';
import Meta from '@zoonk/components/Meta';
import PostComments from '@zoonk/components/PostComments';
import PostsBreadcrumb from '@zoonk/components/PostsBreadcrumb';
import PostView from '@zoonk/components/PostView';
import { Post } from '@zoonk/models';
import { getPost, markPostAsRead } from '@zoonk/services';
import {
  analytics,
  appLanguage,
  getPostImage,
  GlobalContext,
  markdownToText,
  preRender,
  theme,
} from '@zoonk/utils';

interface PostPageProps {
  data: Post.Get;
}

const PostPage: NextPage<PostPageProps> = ({ data }) => {
  const { translate, user } = useContext(GlobalContext);
  const {
    category,
    comments,
    content,
    cover,
    editors,
    id,
    language,
    title,
    topics,
  } = data;
  const image = cover || getPostImage(content);

  useEffect(() => {
    analytics().setCurrentScreen('posts_view');
  }, []);

  useEffect(() => {
    if (user) {
      markPostAsRead(id, user.uid);
    }
  }, [id, user]);

  return (
    <Container component="main">
      <Meta
        title={title}
        description={markdownToText(content.slice(0, 200))}
        canonicalUrl={`https://${language}.zoonk.org/posts/${id}`}
        image={image}
        noIndex={language !== appLanguage}
      />

      <PostsBreadcrumb category={category} topicId={topics[0]} title={title} />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={9} md={8}>
          <PostView item={data} />
        </Grid>

        <Grid item xs={12} sm={3} md={4}>
          <Hidden xsDown>
            <NextLink href="/posts/add" passHref>
              <Button
                component="a"
                fullWidth
                variant="outlined"
                color="primary"
              >
                {translate('post_add')}
              </Button>
            </NextLink>
            <div style={{ margin: theme.spacing(1) }} />
          </Hidden>
          <ItemCredits editors={editors} />
        </Grid>
      </Grid>

      <Grid container spacing={2} style={{ marginTop: theme.spacing(1) }}>
        <Grid item xs={12} sm={9} md={8}>
          <PostComments comments={comments} postId={id} topics={topics} />
        </Grid>
      </Grid>
    </Container>
  );
};

PostPage.getInitialProps = async ({ query }) => {
  const postId = String(query.id);
  const data = await getPost(postId);
  preRender();
  return { data };
};

export default PostPage;
