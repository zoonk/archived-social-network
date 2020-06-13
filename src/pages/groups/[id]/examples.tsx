import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Container } from '@material-ui/core';
import PostShare from '@zoonk/components/PostShare';
import Meta from '@zoonk/components/Meta';
import GroupsBreadcrumb from '@zoonk/components/GroupsBreadcrumb';
import useTranslation from '@zoonk/components/useTranslation';
import { theme } from '@zoonk/utils';

const PostsCard = dynamic(() => import('@zoonk/components/PostsCard'), {
  ssr: false,
});

const GroupExamples: NextPage = () => {
  const translate = useTranslation();
  const { query } = useRouter();
  const groupId = String(query.id);

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
