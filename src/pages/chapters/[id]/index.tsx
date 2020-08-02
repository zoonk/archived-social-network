import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import Error from 'next/error';
import { useRouter } from 'next/router';
import { CircularProgress, Container, Grid } from '@material-ui/core';
import ChapterDetails from '@zoonk/components/ChapterDetails';
import ChapterNav from '@zoonk/components/ChapterNav';
import LessonsCard from '@zoonk/components/LessonsCard';
import Meta from '@zoonk/components/Meta';
import TopicsBreadcrumb from '@zoonk/components/TopicsBreadcrumb';
import useChapterProgress from '@zoonk/components/useChapterProgress';
import { Chapter } from '@zoonk/models';
import { getChapter } from '@zoonk/services';

interface ChapterProps {
  data: Chapter.Get | null;
}

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: true };
};

export const getStaticProps: GetStaticProps<ChapterProps> = async ({
  params,
}) => {
  const id = String(params?.id);
  const data = await getChapter(id);
  return { props: { data }, revalidate: 1 };
};

const ChapterPage = ({
  data,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { isFallback } = useRouter();
  const { completed, progress } = useChapterProgress({
    chapter: data,
    chapterId: data?.id,
  });

  if (!data && isFallback) return <CircularProgress />;
  if (!data) return <Error statusCode={404} />;

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
          <ChapterDetails completed={completed} data={data} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <LessonsCard
            chapterId={id}
            topicId={topics[0]}
            lessons={lessonData}
            category="lessons"
            progress={progress}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <LessonsCard
            chapterId={id}
            topicId={topics[0]}
            lessons={exampleData}
            category="examples"
            progress={progress}
          />
        </Grid>
        <Grid item xs={12}>
          <ChapterNav chapterId={id} topicId={topics[0]} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default ChapterPage;
