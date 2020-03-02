import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { Container, Grid, makeStyles } from '@material-ui/core';
import ChaptersCard from '@zoonk/components/ChaptersCard';
import ItemCredits from '@zoonk/components/ItemCredits';
import LeaderboardCard from '@zoonk/components/LeaderboardCard';
import Meta from '@zoonk/components/Meta';
import PostsCard from '@zoonk/components/PostsCard';
import TopicDetails from '@zoonk/components/TopicDetails';
import TopicsBreadcrumb from '@zoonk/components/TopicsBreadcrumb';
import { Topic } from '@zoonk/models';
import { getTopic } from '@zoonk/services';
import { analytics, appLanguage, GlobalContext, preRender } from '@zoonk/utils';

const useStyles = makeStyles((theme) => ({
  column: {
    '& > *': {
      marginBottom: theme.spacing(2),
    },
  },
}));

interface TopicPageProps {
  topic: Topic.Get;
}

const TopicPage: NextPage<TopicPageProps> = ({ topic }) => {
  const { translate } = useContext(GlobalContext);
  const classes = useStyles();
  const {
    chapterData,
    createdAt,
    createdBy,
    id,
    language,
    photo,
    title,
    updatedAt,
    updatedBy,
  } = topic;

  useEffect(() => {
    analytics().setCurrentScreen('topic');
  }, []);

  return (
    <Container component="main">
      <Meta
        title={translate('learn_about', { title })}
        description={translate('seo_topic_desc', { title })}
        image={photo}
        canonicalUrl={`https://${language}.zoonk.org/topics/${id}`}
        noIndex={appLanguage !== language}
      />

      <TopicsBreadcrumb title={title} />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4} className={classes.column}>
          <TopicDetails topic={topic} />
          <ItemCredits
            createdAt={createdAt}
            createdBy={createdBy}
            updatedAt={updatedAt}
            updatedBy={updatedBy}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={8} className={classes.column}>
          <ChaptersCard chapters={chapterData} />
          <PostsCard
            category={['examples']}
            topicId={id}
            limit={3}
            allowAdd
            orderBy={['likes']}
            title={translate('examples')}
          />
          <PostsCard
            category={['lessons', 'posts']}
            topicId={id}
            limit={3}
            list="posts"
            allowAdd
            title={translate('posts')}
          />
          <PostsCard
            category={['questions']}
            topicId={id}
            limit={3}
            allowAdd
            orderBy={['likes']}
            title={translate('questions')}
          />
          <PostsCard
            category={['courses']}
            topicId={id}
            limit={3}
            allowAdd
            orderBy={['likes']}
            title={translate('courses')}
          />
          <PostsCard
            category={['books']}
            topicId={id}
            limit={3}
            allowAdd
            orderBy={['likes']}
            title={translate('books')}
          />
          <LeaderboardCard topicId={id} />
        </Grid>
      </Grid>
    </Container>
  );
};

TopicPage.getInitialProps = async ({ query }) => {
  const topic = await getTopic(String(query.id));
  preRender();
  return { topic };
};

export default TopicPage;
