import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { Container, Grid, makeStyles } from '@material-ui/core';
import ChapterDetails from '@zoonk/components/ChapterDetails';
import ChaptersBreadcrumb from '@zoonk/components/ChaptersBreadcrumb';
import ItemCredits from '@zoonk/components/ItemCredits';
import Meta from '@zoonk/components/Meta';
import NotesCard from '@zoonk/components/NotesCard';
import PostsCard from '@zoonk/components/PostsCard';
import { Chapter } from '@zoonk/models';
import { getChapter } from '@zoonk/services';
import { analytics, GlobalContext, preRender } from '@zoonk/utils';

const useStyles = makeStyles((theme) => ({
  column: {
    '& > *': {
      marginBottom: theme.spacing(2),
    },
  },
}));

interface ChapterProps {
  data: Chapter.Get;
}

const ChapterPage: NextPage<ChapterProps> = ({ data }) => {
  const { translate } = useContext(GlobalContext);
  const classes = useStyles();
  const {
    createdAt,
    createdBy,
    id,
    description,
    language,
    pathId,
    photo,
    title,
    topics,
    updatedAt,
    updatedBy,
  } = data;

  useEffect(() => {
    analytics().setCurrentScreen('chapter_view');
  }, []);

  return (
    <Container component="main">
      <Meta
        title={title}
        description={description.slice(0, 200)}
        image={photo}
        canonicalUrl={`https://${language}.zoonk.org/paths/${pathId}/chapters/${id}`}
      />

      <ChaptersBreadcrumb topicId={topics[0]} pathId={pathId} title={title} />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4} className={classes.column}>
          <ChapterDetails data={data} />
          <NotesCard category="chapters" id={id} itemPath={`chapters/${id}`} />
          <ItemCredits
            createdAt={createdAt}
            createdBy={createdBy}
            updatedAt={updatedAt}
            updatedBy={updatedBy}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={8} className={classes.column}>
          <PostsCard
            category="lessons"
            chapterId={id}
            limit={20}
            allowAdd
            allowLoadMore
            hideLink
            title={translate('lessons')}
          />
          <PostsCard
            category="examples"
            chapterId={id}
            limit={3}
            allowAdd
            title={translate('examples')}
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
