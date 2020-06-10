import { useContext } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Container } from '@material-ui/core';
import EditsList from '@zoonk/components/EditsList';
import Meta from '@zoonk/components/Meta';
import GroupsBreadcrumb from '@zoonk/components/GroupsBreadcrumb';
import { GlobalContext, rootUrl } from '@zoonk/utils';

const GroupEdits: NextPage = () => {
  const { query } = useRouter();
  const { translate } = useContext(GlobalContext);
  const id = String(query.id);

  return (
    <Container component="main">
      <Meta
        title={translate('page_edits')}
        canonicalUrl={`${rootUrl}/groups/${id}/edits`}
        noIndex
      />

      <GroupsBreadcrumb groupId={id} title={translate('see_all_edits')} />
      {query.id && <EditsList itemPath={`groups/${id}`} />}
    </Container>
  );
};

export default GroupEdits;
