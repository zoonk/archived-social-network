import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { Container } from '@material-ui/core';
import Meta from '@zoonk/components/Meta';
import SidebarPage from '@zoonk/components/SidebarPage';
import useTranslation from '@zoonk/components/useTranslation';
import { rootUrl } from '@zoonk/utils';

const PostsCard = dynamic(() => import('@zoonk/components/PostsCard'), {
  ssr: false,
});

const Books: NextPage = () => {
  const translate = useTranslation();

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
