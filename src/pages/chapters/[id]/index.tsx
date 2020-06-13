import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import Error from 'next/error';
import { useRouter } from 'next/router';
import { CircularProgress, Container, Grid } from '@material-ui/core';
import ChapterDetails from '@zoonk/components/ChapterDetails';
import LessonsCard from '@zoonk/components/LessonsCard';
import Meta from '@zoonk/components/Meta';
import TopicsBreadcrumb from '@zoonk/components/TopicsBreadcrumb';
import { Chapter } from '@zoonk/models';
import { getChapter, listChapters } from '@zoonk/services';

interface ChapterProps {
  data: Chapter.Get | null;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const chapters = await listChapters(10);
  const paths = chapters.map((chapter) => ({ params: { id: chapter.id } }));
  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps<ChapterProps> = async ({
  params,
}) => {
  const id = String(params?.id);
  const data = await getChapter(id);
  return { props: { data }, unstable_revalidate: 1 };
};

const ChapterPage = ({
  data,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { isFallback } = useRouter();

  if (!data && !isFallback) return <Error statusCode={404} />;
  if (!data) return <CircularProgress />;

  const {
    id,
    description,
    exampleData,
    language,
    lessonData,
    title,
    topics,
  } = data;

  return (
    <Container component="main">
      <Meta
        title={title}
        description={description.slice(0, 200)}
        canonicalUrl={`https://${language}.zoonk.org/chapters/${id}`}
      />

      <TopicsBreadcrumb topicId={topics[0]} title={title} />

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <ChapterDetails data={data} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <LessonsCard
            chapterId={id}
            topicId={topics[0]}
            lessons={lessonData}
            category="lessons"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <LessonsCard
            chapterId={id}
            topicId={topics[0]}
            lessons={exampleData}
            category="examples"
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default ChapterPage;
