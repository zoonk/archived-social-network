import { useEffect } from 'react';
import { NextPage } from 'next';
import { Container, Grid } from '@material-ui/core';
import ChapterDetails from '@zoonk/components/ChapterDetails';
import LessonsCard from '@zoonk/components/LessonsCard';
import Meta from '@zoonk/components/Meta';
import TopicsBreadcrumb from '@zoonk/components/TopicsBreadcrumb';
import { Chapter } from '@zoonk/models';
import { getChapter } from '@zoonk/services';
import { analytics, markdownToText, preRender } from '@zoonk/utils';

interface ChapterProps {
  data: Chapter.Get;
  topicId: string;
}

const ChapterPage: NextPage<ChapterProps> = ({ data, topicId }) => {
  const {
    id,
    description,
    exampleData,
    language,
    lessonData,
    title,
    topics,
  } = data;

  useEffect(() => {
    analytics().setCurrentScreen('chapter_view');
  }, []);

  return (
    <Container component="main">
      <Meta
        title={title}
        description={markdownToText(description).slice(0, 200)}
        canonicalUrl={`https://${language}.zoonk.org/topics/${topics[0]}/chapters/${id}`}
      />

      <TopicsBreadcrumb topicId={topicId} title={title} />

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <ChapterDetails data={data} topicId={topicId} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <LessonsCard lessons={lessonData} category="lessons" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <LessonsCard lessons={exampleData} category="examples" />
        </Grid>
      </Grid>
    </Container>
  );
};

ChapterPage.getInitialProps = async ({ query }) => {
  const id = String(query.chapterId);
  const data = await getChapter(id);
  preRender();
  return { data, topicId: String(query.id) };
};

export default ChapterPage;
