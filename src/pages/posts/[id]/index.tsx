import { useEffect } from 'react';
import { NextPage } from 'next';
import { Container, Grid } from '@material-ui/core';
import ItemCredits from '@zoonk/components/ItemCredits';
import Meta from '@zoonk/components/Meta';
import NotesCard from '@zoonk/components/NotesCard';
import PostComments from '@zoonk/components/PostComments';
import PostsBreadcrumb from '@zoonk/components/PostsBreadcrumb';
import PostView from '@zoonk/components/PostView';
import { Post } from '@zoonk/models';
import { getPost } from '@zoonk/services';
import { analytics, appLanguage, preRender, theme } from '@zoonk/utils';

interface PostPageProps {
  data: Post.Get;
}

const PostPage: NextPage<PostPageProps> = ({ data }) => {
  const {
    category,
    comments,
    content,
    createdAt,
    createdBy,
    createdById,
    id,
    language,
    title,
    topics,
    updatedAt,
    updatedBy,
    updatedById,
  } = data;

  useEffect(() => {
    analytics().setCurrentScreen('posts_view');
  }, []);

  return (
    <Container component="main">
      <Meta
        title={title}
        description={content.slice(0, 200)}
        canonicalUrl={`https://${language}.zoonk.org/posts/${id}`}
        noIndex={language !== appLanguage}
      />

      <PostsBreadcrumb category={category} topicId={topics[0]} title={title} />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={9} md={8}>
          <PostView item={data} />
        </Grid>

        <Grid item xs={12} sm={3} md={4}>
          <ItemCredits
            createdAt={createdAt}
            createdBy={createdBy}
            createdById={createdById}
            updatedAt={updatedAt}
            updatedBy={updatedBy}
            updatedById={updatedById}
          />
          <div style={{ padding: theme.spacing(1) }} />
          <NotesCard category="posts" id={id} itemPath={`posts/${id}`} />
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
