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

const GroupPosts: NextPage = () => {
  const translate = useTranslation();
  const { query } = useRouter();
  const groupId = String(query.id);

  return (
    <Container component="main">
      <Meta title={translate('posts')} noIndex />
      <GroupsBreadcrumb groupId={groupId} title={translate('posts')} />
      <PostShare category="posts" groupId={groupId} />
      <div style={{ margin: theme.spacing(1, 0) }} />
      <PostsCard category={['posts', 'lessons']} groupId={groupId} limit={10} />
    </Container>
  );
};

export default GroupPosts;
