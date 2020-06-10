import { useContext, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { CircularProgress, Container } from '@material-ui/core';
import GroupEdit from '@zoonk/components/GroupEdit';
import GroupFormContainer from '@zoonk/components/GroupFormContainer';
import GroupsBreadcrumb from '@zoonk/components/GroupsBreadcrumb';
import LoginForm from '@zoonk/components/LoginForm';
import Meta from '@zoonk/components/Meta';
import useAuth from '@zoonk/components/useAuth';
import { Group } from '@zoonk/models';
import { getGroup } from '@zoonk/services';
import { GlobalContext } from '@zoonk/utils';

const EditGroup: NextPage = () => {
  const { translate } = useContext(GlobalContext);
  const { user } = useAuth();
  const { query } = useRouter();
  const id = String(query.id);
  const [group, setGroup] = useState<Group.Get>();

  useEffect(() => {
    if (query.id && user) {
      getGroup(String(query.id)).then(setGroup);
    }
  }, [query.id, user]);

  if (user === null) {
    return <LoginForm />;
  }

  if (user === undefined || !group) {
    return <CircularProgress />;
  }

  return (
    <Container component="main" maxWidth="xs">
      <Meta title={translate('group_edit')} noIndex />
      <GroupsBreadcrumb
        topicId={group.topics[0]}
        groupId={id}
        groupName={group.title}
        title={translate('group_edit')}
      />
      <GroupFormContainer type="edit">
        <GroupEdit data={group} />
      </GroupFormContainer>
    </Container>
  );
};

export default EditGroup;
