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

interface TopicQuestionsProps {
  questions: Post.Get[];
  topic: Topic.Get | null;
}

const limit = 10;

export const getStaticPaths: GetStaticPaths = async () => {
  const topics = await getTopics({ limit: 20 });
  const paths = topics.map((topic) => ({ params: { id: topic.id } }));
  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps<TopicQuestionsProps> = async ({
  params,
}) => {
  const topicId = String(params?.id);
  const topicReq = getTopic(topicId);
  const questionsReq = getPosts({ category: ['questions'], topicId, limit });
  const [topic, questions] = await Promise.all([topicReq, questionsReq]);
  return { props: { questions, topic }, revalidate: 1 };
};

const TopicQuestions = ({
  questions,
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
        title={translate('seo_topic_questions_title', { title })}
        description={translate('seo_topic_questions_desc', { title })}
        image={photo}
        canonicalUrl={`https://${language}.zoonk.org/topics/${id}/questions`}
      />
      <TopicsBreadcrumb topicId={id} title={translate('questions')} />
      <TopicBase topic={topic}>
        <PostShare
          category="questions"
          title={translate('ask_question')}
          topicId={id}
        />
        <PostsList
          data={questions}
          category={['questions']}
          topicId={id}
          limit={10}
        />
      </TopicBase>
    </Container>
  );
};

export default TopicQuestions;
