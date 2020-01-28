import { useEffect } from 'react';
import { NextPage } from 'next';
import { Container, Grid } from '@material-ui/core';
import ChaptersCard from '@zoonk/components/ChaptersCard';
import ItemCredits from '@zoonk/components/ItemCredits';
import Meta from '@zoonk/components/Meta';
import NotesCard from '@zoonk/components/NotesCard';
import PathBreadcrumb from '@zoonk/components/PathBreadcrumb';
import PathDetails from '@zoonk/components/PathDetails';
import { Path } from '@zoonk/models';
import { getPath } from '@zoonk/services';
import { analytics, preRender, theme } from '@zoonk/utils';

interface PathProps {
  data: Path.Get;
}

const PathPage: NextPage<PathProps> = ({ data }) => {
  useEffect(() => {
    analytics().setCurrentScreen('path_view');
  }, []);

  return (
    <Container component="main">
      <Meta
        title={data.title}
        description={data.description.slice(0, 200)}
        image={data.photo}
        canonicalUrl={`https://${data.language}.zoonk.org/paths/${data.id}`}
      />

      <PathBreadcrumb title={data.title} topicId={data.topics[0]} />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <PathDetails data={data} />
          <div style={{ padding: theme.spacing(1) }} />
          <NotesCard
            category="paths"
            id={data.id}
            itemPath={`paths/${data.id}`}
          />
          <div style={{ padding: theme.spacing(1) }} />
          <ItemCredits
            createdAt={data.createdAt}
            createdBy={data.createdBy}
            updatedAt={data.updatedAt}
            updatedBy={data.updatedBy}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={8}>
          <ChaptersCard pathId={data.id} />
        </Grid>
      </Grid>
    </Container>
  );
};

PathPage.getInitialProps = async ({ query }) => {
  const id = String(query.id);
  const data = await getPath(id);
  preRender();
  return { data };
};

export default PathPage;
