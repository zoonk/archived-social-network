import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { Container, Grid } from '@material-ui/core';
import ChaptersBreadcrumb from '@zoonk/components/ChaptersBreadcrumb';
import ItemCredits from '@zoonk/components/ItemCredits';
import Meta from '@zoonk/components/Meta';
import PostComments from '@zoonk/components/PostComments';
import PostView from '@zoonk/components/PostView';
import { Post } from '@zoonk/models';
import { getPost, togglePostProgress } from '@zoonk/services';
import {
  analytics,
  appLanguage,
  GlobalContext,
  preRender,
  theme,
} from '@zoonk/utils';

interface PostPageProps {
  data: Post.Get;
  chapterId: string;
  topicId: string;
}

const LessonPage: NextPage<PostPageProps> = ({ chapterId, data, topicId }) => {
  const { translate, user } = useContext(GlobalContext);
  const {
    category,
    comments,
    content,
    editors,
    id,
    language,
    title,
    topics,
  } = data;

  useEffect(() => {
    analytics().setCurrentScreen('lesson_page');
  }, []);

  // Mark a post as read when the page is visited.
  useEffect(() => {
    if (
      user &&
      chapterId &&
      (category === 'lessons' || category === 'examples')
    ) {
      togglePostProgress(id, chapterId, category, false, user.uid);
    }
  }, [category, chapterId, id, user]);

  return (
    <Container component="main">
      <Meta
        title={title}
        description={content.slice(0, 200)}
        canonicalUrl={`https://${language}.zoonk.org/posts/${id}`}
        noIndex={language !== appLanguage}
      />

      <ChaptersBreadcrumb title={translate('chapter')} page={title} />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={9} md={8}>
          <PostView chapterId={chapterId} topicId={topicId} item={data} />
        </Grid>

        <Grid item xs={12} sm={3} md={4}>
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

LessonPage.getInitialProps = async ({ query }) => {
  const postId = String(query.lessonId);
  const data = await getPost(postId);
  preRender();
  return {
    data,
    chapterId: String(query.chapterId),
    topicId: String(query.id),
  };
};

export default LessonPage;
