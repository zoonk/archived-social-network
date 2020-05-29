import { useContext, useEffect } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { Container, Grid, makeStyles } from '@material-ui/core';
import GroupDetails from '@zoonk/components/GroupDetails';
import GroupPinned from '@zoonk/components/GroupPinned';
import GroupsBreadcrumb from '@zoonk/components/GroupsBreadcrumb';
import ItemCredits from '@zoonk/components/ItemCredits';
import MenuCommunity from '@zoonk/components/MenuCommunity';
import Meta from '@zoonk/components/Meta';
import PostsCard from '@zoonk/components/PostsCard';
import PostShare from '@zoonk/components/PostShare';
import { Group } from '@zoonk/models';
import { getGroup } from '@zoonk/services';
import { analytics, appLanguage, GlobalContext, preRender } from '@zoonk/utils';

const useStyles = makeStyles((theme) => ({
  column: {
    '& > *': {
      marginBottom: theme.spacing(2),
    },
  },
}));

interface GroupPageProps {
  group: Group.Get;
}

const GroupPage: NextPage<GroupPageProps> = ({ group }) => {
  const { translate } = useContext(GlobalContext);
  const classes = useStyles();
  const {
    createdBy,
    createdById,
    description,
    id,
    language,
    photo,
    title,
    topics,
  } = group;
  const author = { ...createdBy, id: createdById };

  useEffect(() => {
    analytics().setCurrentScreen('group');
  }, []);

  return (
    <Container component="main">
      <Meta
        title={title}
        description={description.slice(0, 200)}
        image={photo}
        canonicalUrl={`https://${language}.zoonk.org/groups/${id}`}
        noIndex={appLanguage !== language}
      />

      <GroupsBreadcrumb topicId={topics[0]} title={title} />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4} className={classes.column}>
          <GroupDetails group={group} />
          <ItemCredits editors={[author]} title={translate('created_by')} />
          <MenuCommunity category="groups" id={id} />
        </Grid>

        <Grid item xs={12} sm={6} md={8} className={classes.column}>
          <PostShare groupId={id} topicId={topics[0]} />
          <GroupPinned group={group} />
          <PostsCard groupId={id} limit={10} displayFilter />
        </Grid>
      </Grid>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const group = await getGroup(String(query.id));
  preRender();
  return { props: { group } };
};

export default GroupPage;
