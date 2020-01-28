import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Container } from '@material-ui/core';
import EditsList from '@zoonk/components/EditsList';
import LinkPath from '@zoonk/components/LinkPath';
import Meta from '@zoonk/components/Meta';
import PathsBreadcrumb from '@zoonk/components/PathsBreadcrumb';
import { analytics, GlobalContext } from '@zoonk/utils';

const PathEdits: NextPage = () => {
  const { translate } = useContext(GlobalContext);
  const { query } = useRouter();
  const id = String(query.id);

  useEffect(() => {
    analytics().setCurrentScreen('path_edits');
  }, []);

  return (
    <Container component="main">
      <Meta title={translate('page_edits')} noIndex />

      <PathsBreadcrumb title={translate('see_all_edits')}>
        <LinkPath id={id} title={translate('selected_item')} />
      </PathsBreadcrumb>

      {query.id && <EditsList itemPath={`paths/${query.id}`} />}
    </Container>
  );
};

export default PathEdits;
