import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { Container } from '@material-ui/core';
import Meta from '@zoonk/components/Meta';
import PostsList from '@zoonk/components/PostsList';
import SidebarPage from '@zoonk/components/SidebarPage';
import useTranslation from '@zoonk/components/useTranslation';
import { Post } from '@zoonk/models';
import { getPosts } from '@zoonk/services';
import { rootUrl } from '@zoonk/utils';

interface BooksProps {
  data: Post.Get[];
}

const limit = 10;

export const getStaticProps: GetStaticProps<BooksProps> = async () => {
  const data = await getPosts({ category: ['books'], limit });
  return { props: { data }, revalidate: 1 };
};

const Books = ({ data }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const translate = useTranslation();

  return (
    <Container component="main">
      <Meta
        title={translate('books')}
        description={translate('seo_books_desc')}
        canonicalUrl={`${rootUrl}/books`}
      />
      <SidebarPage category="books" title={translate('teach_book_title')}>
        <PostsList data={data} limit={limit} category={['books']} />
      </SidebarPage>
    </Container>
  );
};

export default Books;
