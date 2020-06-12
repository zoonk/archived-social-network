import { useContext } from 'react';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { Container } from '@material-ui/core';
import GroupsBreadcrumb from '@zoonk/components/GroupsBreadcrumb';
import GroupFormContainer from '@zoonk/components/GroupFormContainer';
import Meta from '@zoonk/components/Meta';
import { GlobalContext } from '@zoonk/utils';

const GroupCreate = dynamic(() => import('@zoonk/components/GroupCreate'), {
  ssr: false,
});

const CreateGroup: NextPage = () => {
  const { translate } = useContext(GlobalContext);

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
