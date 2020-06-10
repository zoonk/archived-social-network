import { useContext, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { CircularProgress, Container } from '@material-ui/core';
import HavingIssuesLink from '@zoonk/components/HavingIssuesLink';
import LoginForm from '@zoonk/components/LoginForm';
import Meta from '@zoonk/components/Meta';
import Snackbar from '@zoonk/components/Snackbar';
import TopicCreate from '@zoonk/components/TopicCreate';
import TopicFormContainer from '@zoonk/components/TopicFormContainer';
import TopicsBreadcrumb from '@zoonk/components/TopicsBreadcrumb';
import useAuth from '@zoonk/components/useAuth';
import { SnackbarAction, Topic, WikipediaSearchItem } from '@zoonk/models';
import { createTopic, getWikipediaPage, validateTopic } from '@zoonk/services';
import {
  analytics,
  appLanguage,
  firebaseError,
  GlobalContext,
  rootUrl,
  timestamp,
} from '@zoonk/utils';

const CreateTopic: NextPage = () => {
  const { translate } = useContext(GlobalContext);
  const { profile, user } = useAuth();
  const { push } = useRouter();
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);

  useEffect(() => {
    analytics().setCurrentScreen('topics_create');
  }, []);

  if (user === undefined) {
    return <CircularProgress />;
  }

  if (user === null || !profile) {
    return <LoginForm />;
  }

  const goToTopic = (id: string) => {
    push('/topics/[id]', `/topics/${id}`);
  };

  const handleSubmit = async (selected: WikipediaSearchItem) => {
    setSnackbar({ type: 'progress', msg: translate('saving') });

    const page = await getWikipediaPage(selected.title, appLanguage);
    const { description, photo, slug, title } = page;
    const topicId = `${slug}_${appLanguage}`;
    const isValid = await validateTopic(topicId);

    if (!isValid) {
      setSnackbar(null);
      goToTopic(topicId);
      return;
    }

    const topic: Topic.Create = {
      chapters: [],
      comments: 0,
      createdAt: timestamp,
      createdBy: profile,
      createdById: user.uid,
      description,
      followers: 0,
      language: appLanguage,
      likes: 0,
      photo,
      posts: 0,
      title,
      topics: [topicId],
      updatedAt: timestamp,
      updatedBy: profile,
      updatedById: user.uid,
    };

    createTopic(topic, topicId)
      .then(() => {
        setSnackbar(null);
        goToTopic(topicId);
      })
      .catch((e) => setSnackbar(firebaseError(e, 'topic_add')));
  };

  return (
    <Container component="main" maxWidth="xs">
      <Meta
        title={translate('topic_create')}
        description={translate('seo_topics_create_desc')}
        canonicalUrl={`${rootUrl}/topics/add`}
      />
      <TopicsBreadcrumb title={translate('topic_create')} />
      <TopicFormContainer type="add">
        <TopicCreate onSubmit={handleSubmit} />
        <HavingIssuesLink />
      </TopicFormContainer>
      <Snackbar action={snackbar} />
    </Container>
  );
};

export default CreateTopic;
