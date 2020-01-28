import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { Container } from '@material-ui/core';
import Meta from '@zoonk/components/Meta';
import PathCreate from '@zoonk/components/PathCreate';
import PathFormContainer from '@zoonk/components/PathFormContainer';
import PathsBreadcrumb from '@zoonk/components/PathsBreadcrumb';
import { analytics, GlobalContext } from '@zoonk/utils';

const PathAdd: NextPage = () => {
  const { translate } = useContext(GlobalContext);

  useEffect(() => {
    analytics().setCurrentScreen('paths_add');
  }, []);

  return (
    <Container component="main" maxWidth="xs">
      <Meta title={translate('path_add')} noIndex />
      <PathsBreadcrumb title={translate('create')} />
      <PathFormContainer type="add">
        <PathCreate />
      </PathFormContainer>
    </Container>
  );
};

export default PathAdd;
