import { useContext, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { CircularProgress, Container } from '@material-ui/core';
import LoginForm from '@zoonk/components/LoginForm';
import Meta from '@zoonk/components/Meta';
import TopicEdit from '@zoonk/components/TopicEdit';
import TopicFormContainer from '@zoonk/components/TopicFormContainer';
import TopicsBreadcrumb from '@zoonk/components/TopicsBreadcrumb';
import useAuth from '@zoonk/components/useAuth';
import { Topic } from '@zoonk/models';
import { getTopic } from '@zoonk/services';
import { analytics, GlobalContext } from '@zoonk/utils';

const EditTopic: NextPage = () => {
  const { translate } = useContext(GlobalContext);
  const { user } = useAuth();
  const { query } = useRouter();
  const id = String(query.id);
  const [topic, setTopic] = useState<Topic.Get>();

  useEffect(() => {
    analytics().setCurrentScreen('topic_edit');
  }, []);

  useEffect(() => {
    if (query.id && user) {
      getTopic(String(query.id)).then(setTopic);
    }
  }, [query.id, user]);

  if (user === null) {
    return <LoginForm />;
  }

  if (user === undefined || !topic) {
    return <CircularProgress />;
  }

  return (
    <Container component="main" maxWidth="xs">
      <Meta title={translate('edit_topic')} noIndex />
      <TopicsBreadcrumb topicId={id} title={translate('edit_topic')} />
      <TopicFormContainer>
        <TopicEdit topic={topic} />
      </TopicFormContainer>
    </Container>
  );
};

export default EditTopic;
