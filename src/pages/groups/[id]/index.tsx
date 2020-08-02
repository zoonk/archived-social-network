import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import Error from 'next/error';
import { useRouter } from 'next/router';
import { CircularProgress, Container } from '@material-ui/core';
import GroupBase from '@zoonk/components/GroupBase';
import GroupsBreadcrumb from '@zoonk/components/GroupsBreadcrumb';
import GroupPinned from '@zoonk/components/GroupPinned';
import Meta from '@zoonk/components/Meta';
import PostShare from '@zoonk/components/PostShare';
import PostsList from '@zoonk/components/PostsList';
import { Group, Post } from '@zoonk/models';
import { getGroup, getGroups, getPosts } from '@zoonk/services';
import { appLanguage } from '@zoonk/utils';

interface GroupPageProps {
  group: Group.Get | null;
  posts: Post.Get[];
}

const limit = 10;

export const getStaticPaths: GetStaticPaths = async () => {
  const groups = await getGroups({ limit: 20 });
  const paths = groups.map((group) => ({ params: { id: group.id } }));
  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps<GroupPageProps> = async ({
  params,
}) => {
  const groupId = String(params?.id);
  const groupReq = getGroup(groupId);
  const postsReq = getPosts({ groupId, limit });
  const [group, posts] = await Promise.all([groupReq, postsReq]);
  return { props: { group, posts }, revalidate: 1 };
};

const GroupPage = ({
  group,
  posts,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { isFallback } = useRouter();

  if (!group && isFallback) return <CircularProgress />;
  if (!group) return <Error statusCode={404} />;

  const { description, id, language, photo, title, topics } = group;

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
      <GroupBase group={group}>
        <PostShare groupId={id} topicId={topics[0]} />
        <GroupPinned group={group} />
        <PostsList data={posts} groupId={id} limit={10} />
      </GroupBase>
    </Container>
  );
};

export default GroupPage;
