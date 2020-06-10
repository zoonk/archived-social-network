import { useContext } from 'react';
import { NextPage } from 'next';
import { Container } from '@material-ui/core';
import Meta from '@zoonk/components/Meta';
import PostsCard from '@zoonk/components/PostsCard';
import SidebarPage from '@zoonk/components/SidebarPage';
import { GlobalContext, rootUrl } from '@zoonk/utils';

const Books: NextPage = () => {
  const { translate } = useContext(GlobalContext);

  return (
    <Container component="main">
      <Meta
        title={translate('books')}
        description={translate('seo_books_desc')}
        canonicalUrl={`${rootUrl}/books`}
      />
      <SidebarPage category="books" title={translate('teach_book_title')}>
        <PostsCard category={['books']} limit={10} />
      </SidebarPage>
    </Container>
  );
};

export default Books;
