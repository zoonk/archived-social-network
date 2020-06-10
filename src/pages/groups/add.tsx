import { useContext } from 'react';
import { NextPage } from 'next';
import { CircularProgress, Container } from '@material-ui/core';
import GroupsBreadcrumb from '@zoonk/components/GroupsBreadcrumb';
import GroupCreate from '@zoonk/components/GroupCreate';
import GroupFormContainer from '@zoonk/components/GroupFormContainer';
import LoginForm from '@zoonk/components/LoginForm';
import Meta from '@zoonk/components/Meta';
import useAuth from '@zoonk/components/useAuth';
import { GlobalContext } from '@zoonk/utils';

const CreateGroup: NextPage = () => {
  const { translate } = useContext(GlobalContext);
  const { profile, user } = useAuth();

  if (user === undefined) {
    return <CircularProgress />;
  }

  if (user === null || !profile) {
    return <LoginForm />;
  }

  return (
    <Container component="main" maxWidth="xs">
      <Meta title={translate('group_create')} noIndex />
      <GroupsBreadcrumb title={translate('group_create')} />
      <GroupFormContainer type="add">
        <GroupCreate />
      </GroupFormContainer>
    </Container>
  );
};

export default CreateGroup;
