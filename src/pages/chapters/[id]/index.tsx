import { NextPage } from 'next';
import { Container, Grid } from '@material-ui/core';
import ChapterDetails from '@zoonk/components/ChapterDetails';
import LessonsCard from '@zoonk/components/LessonsCard';
import Meta from '@zoonk/components/Meta';
import TopicsBreadcrumb from '@zoonk/components/TopicsBreadcrumb';
import { Chapter } from '@zoonk/models';
import { getChapter } from '@zoonk/services';
import { preRender } from '@zoonk/utils';

interface ChapterProps {
  data: Chapter.Get;
}

const ChapterPage: NextPage<ChapterProps> = ({ data }) => {
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

ChapterPage.getInitialProps = async ({ query }) => {
  const id = String(query.id);
  const data = await getChapter(id);
  preRender();
  return { data };
};

export default ChapterPage;
