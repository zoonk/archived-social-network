import { useContext, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { CircularProgress, Container } from '@material-ui/core';
import LinkPath from '@zoonk/components/LinkPath';
import Meta from '@zoonk/components/Meta';
import PathEdit from '@zoonk/components/PathEdit';
import PathFormContainer from '@zoonk/components/PathFormContainer';
import PathsBreadcrumb from '@zoonk/components/PathsBreadcrumb';
import { Path } from '@zoonk/models';
import { getPath } from '@zoonk/services';
import { analytics, GlobalContext } from '@zoonk/utils';

const PathEditPage: NextPage = () => {
  const { translate } = useContext(GlobalContext);
  const { query } = useRouter();
  const [path, setPath] = useState<Path.Get>();

  useEffect(() => {
    analytics().setCurrentScreen('path_edit');
  }, []);

  useEffect(() => {
    if (query.id) {
      getPath(String(query.id)).then(setPath);
    }
  }, [query.id]);

  if (!path) {
    return <CircularProgress />;
  }

  return (
    <Container component="main" maxWidth="xs">
      <Meta title={translate('path_edit')} noIndex />
      <PathsBreadcrumb title={translate('edit')}>
        <LinkPath id={path.id} title={path.title} />
      </PathsBreadcrumb>
      <PathFormContainer>
        <PathEdit data={path} />
      </PathFormContainer>
    </Container>
  );
};

export default PathEditPage;
