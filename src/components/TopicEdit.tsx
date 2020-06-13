import { useEffect, useState } from 'react';
import Error from 'next/error';
import { CircularProgress } from '@material-ui/core';
import { Topic } from '@zoonk/models';
import { getTopic } from '@zoonk/services';
import LoginForm from './LoginForm';
import TopicEditForm from './TopicEditForm';
import TopicFormContainer from './TopicFormContainer';
import useAuth from './useAuth';

interface TopicEditProps {
  id: string;
}

const TopicEdit = ({ id }: TopicEditProps) => {
  const { user } = useAuth();
  const [topic, setTopic] = useState<Topic.Get | null>();

  useEffect(() => {
    getTopic(id).then(setTopic);
  }, [id]);

  if (user === null) return <LoginForm />;
  if (topic === null) return <Error statusCode={404} />;
  if (topic === undefined || user === undefined) return <CircularProgress />;

  return (
    <TopicFormContainer>
      <TopicEditForm topic={topic} />
    </TopicFormContainer>
  );
};

export default TopicEdit;
