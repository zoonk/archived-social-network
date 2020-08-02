import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import Error from 'next/error';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import {
  Button,
  CircularProgress,
  Container,
  makeStyles,
} from '@material-ui/core';
import GroupList from '@zoonk/components/GroupList';
import Meta from '@zoonk/components/Meta';
import TopicBase from '@zoonk/components/TopicBase';
import TopicsBreadcrumb from '@zoonk/components/TopicsBreadcrumb';
import useTranslation from '@zoonk/components/useTranslation';
import { Group, Topic } from '@zoonk/models';
import { getGroups, getTopic, getTopics } from '@zoonk/services';

const useStyles = makeStyles((theme) => ({
  create: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: theme.spacing(1),
  },
}));

interface TopicGroupsProps {
  groups: Group.Get[];
  topic: Topic.Get | null;
}

const limit = 10;

export const getStaticPaths: GetStaticPaths = async () => {
  const topics = await getTopics({ limit: 20 });
  const paths = topics.map((topic) => ({ params: { id: topic.id } }));
  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps<TopicGroupsProps> = async ({
  params,
}) => {
  const topicId = String(params?.id);
  const topicReq = getTopic(topicId);
  const groupsReq = getGroups({ topicId, limit });
  const [topic, groups] = await Promise.all([topicReq, groupsReq]);
  return { props: { groups, topic }, revalidate: 1 };
};

const TopicGroups = ({
  groups,
  topic,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const translate = useTranslation();
  const classes = useStyles();

  const { isFallback } = useRouter();

  if (!topic && isFallback) return <CircularProgress />;
  if (!topic) return <Error statusCode={404} />;

  const { id, language, photo, title } = topic;

  return (
    <Container component="main">
      <Meta
        title={translate('seo_topic_groups_title', { title })}
        description={translate('seo_topic_groups_desc', { title })}
        image={photo}
        canonicalUrl={`https://${language}.zoonk.org/topics/${id}/groups`}
      />
      <TopicsBreadcrumb topicId={id} title={translate('groups')} />
      <TopicBase topic={topic}>
        <div className={classes.create}>
          <NextLink href={`/groups/add?topicId=${id}`} passHref>
            <Button component="a" color="primary" variant="outlined">
              {translate('group_create')}
            </Button>
          </NextLink>
        </div>
        <GroupList data={groups} topicId={id} limit={limit} />
      </TopicBase>
    </Container>
  );
};

export default TopicGroups;
