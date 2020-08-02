import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import Error from 'next/error';
import { useRouter } from 'next/router';
import { CircularProgress, Container } from '@material-ui/core';
import PostsList from '@zoonk/components/PostsList';
import Meta from '@zoonk/components/Meta';
import PostShare from '@zoonk/components/PostShare';
import TopicBase from '@zoonk/components/TopicBase';
import TopicsBreadcrumb from '@zoonk/components/TopicsBreadcrumb';
import useTranslation from '@zoonk/components/useTranslation';
import { Post, Topic } from '@zoonk/models';
import { getPosts, getTopic, getTopics } from '@zoonk/services';

interface TopicBooksProps {
  books: Post.Get[];
  topic: Topic.Get | null;
}

const limit = 10;

export const getStaticPaths: GetStaticPaths = async () => {
  const topics = await getTopics({ limit: 20 });
  const paths = topics.map((topic) => ({ params: { id: topic.id } }));
  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps<TopicBooksProps> = async ({
  params,
}) => {
  const topicId = String(params?.id);
  const topicReq = getTopic(topicId);
  const booksReq = getPosts({ category: ['books'], topicId, limit });
  const [topic, books] = await Promise.all([topicReq, booksReq]);
  return { props: { books, topic }, revalidate: 1 };
};

const TopicBooks = ({
  books,
  topic,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const translate = useTranslation();

  const { isFallback } = useRouter();

  if (!topic && isFallback) return <CircularProgress />;
  if (!topic) return <Error statusCode={404} />;

  const { id, language, photo, title } = topic;

  return (
    <Container component="main">
      <Meta
        title={translate('seo_topic_books_title', { title })}
        description={translate('seo_topic_books_desc', { title })}
        image={photo}
        canonicalUrl={`https://${language}.zoonk.org/topics/${id}/books`}
      />
      <TopicsBreadcrumb topicId={id} title={translate('books')} />
      <TopicBase topic={topic}>
        <PostShare
          category="books"
          title={translate('teach_book_title')}
          topicId={id}
        />
        <PostsList data={books} category={['books']} topicId={id} limit={10} />
      </TopicBase>
    </Container>
  );
};

export default TopicBooks;
