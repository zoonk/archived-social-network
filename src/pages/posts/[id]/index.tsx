import { useContext, useEffect, useState } from 'react';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import { Button, Container, Grid, Hidden } from '@material-ui/core';
import ItemCredits from '@zoonk/components/ItemCredits';
import Meta from '@zoonk/components/Meta';
import PostComments from '@zoonk/components/PostComments';
import PostsBreadcrumb from '@zoonk/components/PostsBreadcrumb';
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
  getPostImage,
  GlobalContext,
  markdownToText,
  preRender,
  theme,
} from '@zoonk/utils';

const LessonsCard = dynamic(() => import('@zoonk/components/LessonsCard'));

interface PostPageProps {
  data: Post.Get;
}

const PostPage: NextPage<PostPageProps> = ({ data }) => {
  const { translate, user } = useContext(GlobalContext);
  const [lessons, setLessons] = useState<Post.Summary[]>([]);
  const {
    category,
    chapterData,
    chapterId,
    comments,
    content,
    cover,
    editors,
    id,
    language,
    sites,
    title,
    topics,
  } = data;
  const siteImg = sites.find((site) => Boolean(site.image));
  const image = cover || getPostImage(content) || siteImg?.image;

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

  /**
   * Get a list of lessons for this chapter.
   */
  useEffect(() => {
    let unsubscribe: firebase.Unsubscribe = () => {};

    if (chapterId) {
      unsubscribe = getChapterLive(chapterId, (chapter) => {
        const items =
          category === 'examples' ? chapter.exampleData : chapter.lessonData;
        setLessons(items);
      });
    }

    return () => unsubscribe();
  }, [category, chapterId]);

  return (
    <Container component="main">
      <Meta
        title={title}
        description={markdownToText(content).slice(0, 200)}
        canonicalUrl={`https://${language}.zoonk.org/posts/${id}`}
        image={image}
        noIndex={language !== appLanguage}
      />

      <PostsBreadcrumb
        category={category}
        chapterId={chapterId}
        chapterName={chapterData?.title}
        topicId={topics[0]}
        title={title}
      />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={9} md={8}>
          <PostView chapterId={chapterId} item={data} />
          <div style={{ margin: theme.spacing(1, 0) }} />
          <PostComments comments={comments} postId={id} topics={topics} />
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
          <div style={{ margin: theme.spacing(1, 0) }} />
          {lessons.length > 0 && chapterId && (
            <LessonsCard
              chapterId={chapterId}
              topicId={topics[0]}
              lessons={lessons}
              category={category as any}
            />
          )}
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
