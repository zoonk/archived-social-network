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

const GroupBooks: NextPage = () => {
  const translate = useTranslation();
  const { query } = useRouter();
  const groupId = String(query.id);

  return (
    <Container component="main">
      <Meta title={translate('books')} noIndex />
      <GroupsBreadcrumb groupId={groupId} title={translate('books')} />
      <PostShare
        category="books"
        title={translate('teach_book_title')}
        groupId={groupId}
      />
      <div style={{ margin: theme.spacing(1, 0) }} />
      <PostsCard category={['books']} groupId={groupId} limit={10} />
    </Container>
  );
};

export default GroupBooks;
