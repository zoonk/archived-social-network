import { useContext } from 'react';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import dynamic from 'next/dynamic';
import Error from 'next/error';
import { useRouter } from 'next/router';
import {
  CircularProgress,
  Container,
  Grid,
  makeStyles,
} from '@material-ui/core';
import GroupDetails from '@zoonk/components/GroupDetails';
import GroupPinned from '@zoonk/components/GroupPinned';
import GroupsBreadcrumb from '@zoonk/components/GroupsBreadcrumb';
import ItemCredits from '@zoonk/components/ItemCredits';
import MenuCommunity from '@zoonk/components/MenuCommunity';
import Meta from '@zoonk/components/Meta';
import PostShare from '@zoonk/components/PostShare';
import { Group } from '@zoonk/models';
import { getGroup, listGroups } from '@zoonk/services';
import { appLanguage, GlobalContext } from '@zoonk/utils';

const PostsCard = dynamic(() => import('@zoonk/components/PostsCard'), {
  ssr: false,
});

const useStyles = makeStyles((theme) => ({
  column: {
    '& > *': {
      marginBottom: theme.spacing(2),
    },
  },
}));

interface GroupPageProps {
  group: Group.Get | null;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const groups = await listGroups({ limit: 20 });
  const paths = groups.map((group) => ({ params: { id: group.id } }));
  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps<GroupPageProps> = async ({
  params,
}) => {
  const id = String(params?.id);
  const group = await getGroup(id);
  return { props: { group }, unstable_revalidate: 1 };
};

const GroupPage = ({
  group,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { translate } = useContext(GlobalContext);
  const classes = useStyles();
  const { isFallback } = useRouter();

  if (!group && isFallback) return <CircularProgress />;
  if (!group) return <Error statusCode={404} />;

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

export default GroupPage;
