import { useContext } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Container } from '@material-ui/core';
import PostsCard from '@zoonk/components/PostsCard';
import PostShare from '@zoonk/components/PostShare';
import Meta from '@zoonk/components/Meta';
import GroupsBreadcrumb from '@zoonk/components/GroupsBreadcrumb';
import { GlobalContext, theme } from '@zoonk/utils';

const GroupBooks: NextPage = () => {
  const { translate } = useContext(GlobalContext);
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
