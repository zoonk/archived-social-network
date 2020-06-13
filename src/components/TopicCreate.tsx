import { Fragment } from 'react';
import { useRouter } from 'next/router';
import { CircularProgress } from '@material-ui/core';
import { timestamp } from '@zoonk/firebase/db';
import { Topic, WikipediaSearchItem } from '@zoonk/models';
import { createTopic, getWikipediaPage, validateTopic } from '@zoonk/services';
import { appLanguage } from '@zoonk/utils';
import HavingIssuesLink from './HavingIssuesLink';
import LoginForm from './LoginForm';
import TopicCreateForm from './TopicCreateForm';
import TopicFormContainer from './TopicFormContainer';
import useAuth from './useAuth';
import useSnackbar from './useSnackbar';

const TopicCreate = () => {
  const { profile, user } = useAuth();
  const { push } = useRouter();
  const { snackbar } = useSnackbar();

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
    snackbar('progress');

    const page = await getWikipediaPage(selected.title, appLanguage);
    const { description, photo, slug, title } = page;
    const topicId = `${slug}_${appLanguage}`;
    const isValid = await validateTopic(topicId);

    if (!isValid) {
      snackbar('dismiss');
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
        snackbar('dismiss');
        goToTopic(topicId);
      })
      .catch((e) => snackbar('error', e.message));
  };

  return (
    <Fragment>
      <TopicFormContainer type="add">
        <TopicCreateForm onSubmit={handleSubmit} />
        <HavingIssuesLink />
      </TopicFormContainer>
    </Fragment>
  );
};

export default TopicCreate;
