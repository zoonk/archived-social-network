import { useContext } from 'react';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { Container } from '@material-ui/core';
import GroupListHeader from '@zoonk/components/GroupListHeader';
import Meta from '@zoonk/components/Meta';
import SidebarPage from '@zoonk/components/SidebarPage';
import { GlobalContext, rootUrl } from '@zoonk/utils';

const GroupList = dynamic(() => import('@zoonk/components/GroupList'), {
  ssr: false,
});

const Groups: NextPage = () => {
  const { translate } = useContext(GlobalContext);

  return (
    <Container component="main">
      <Meta
        title={translate('groups')}
        description={translate('seo_groups_desc')}
        canonicalUrl={`${rootUrl}/groups`}
      />
      <SidebarPage title={translate('post_share')}>
        <GroupListHeader active="all" />
        <GroupList allowLoadMore />
      </SidebarPage>
    </Container>
  );
};

export default Groups;
