import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Container } from '@material-ui/core';
import PostsCard from '@zoonk/components/PostsCard';
import PostShare from '@zoonk/components/PostShare';
import Meta from '@zoonk/components/Meta';
import GroupsBreadcrumb from '@zoonk/components/GroupsBreadcrumb';
import { analytics, GlobalContext, theme } from '@zoonk/utils';

const GroupExamples: NextPage = () => {
  const { translate } = useContext(GlobalContext);
  const { query } = useRouter();
  const groupId = String(query.id);

  useEffect(() => {
    analytics().setCurrentScreen('group_examples');
  }, []);

  return (
    <Container component="main">
      <Meta title={translate('examples')} noIndex />
      <GroupsBreadcrumb groupId={groupId} title={translate('examples')} />
      <PostShare
        category="examples"
        title={translate('teach_example_title')}
        groupId={groupId}
      />
      <div style={{ margin: theme.spacing(1, 0) }} />
      <PostsCard category={['examples']} groupId={groupId} limit={10} />
    </Container>
  );
};

export default GroupExamples;
