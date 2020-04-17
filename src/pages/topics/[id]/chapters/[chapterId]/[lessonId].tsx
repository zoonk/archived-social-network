import { useContext, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Container, Grid } from '@material-ui/core';
import ChaptersBreadcrumb from '@zoonk/components/ChaptersBreadcrumb';
import ItemCredits from '@zoonk/components/ItemCredits';
import LessonsCard from '@zoonk/components/LessonsCard';
import Meta from '@zoonk/components/Meta';
import PostComments from '@zoonk/components/PostComments';
import PostView from '@zoonk/components/PostView';
import { Post } from '@zoonk/models';
import {
  getChapterLive,
  getPost,
  markPostAsRead,
  togglePostProgress,
} from '@zoonk/services';
import {
  analytics,
  appLanguage,
  GlobalContext,
  markdownToText,
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
  const [lessons, setLessons] = useState<Post.Summary[]>([]);
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
      markPostAsRead(id, user.uid);
    }
  }, [category, chapterId, id, user]);

  useEffect(() => {
    const unsubscribe = getChapterLive(chapterId, (chapter) => {
      const items =
        category === 'examples' ? chapter.exampleData : chapter.lessonData;
      setLessons(items);
    });

    return () => unsubscribe();
  }, [category, chapterId]);

  return (
    <Container component="main">
      <Meta
        title={title}
        description={markdownToText(content).slice(0, 200)}
        canonicalUrl={`https://${language}.zoonk.org/posts/${id}`}
        noIndex={language !== appLanguage}
      />

      <ChaptersBreadcrumb title={translate('chapter')} page={title} />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={9} md={8}>
          <PostView chapterId={chapterId} topicId={topicId} item={data} />
          <div style={{ margin: theme.spacing(1, 0) }} />
          <PostComments comments={comments} postId={id} topics={topics} />
        </Grid>

        <Grid item xs={12} sm={3} md={4}>
          <ItemCredits editors={editors} />
          <div style={{ margin: theme.spacing(1, 0) }} />
          {lessons.length > 0 && (
            <LessonsCard category={category as any} lessons={lessons} />
          )}
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
