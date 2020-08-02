import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import Error from 'next/error';
import { useRouter } from 'next/router';
import { CircularProgress, Container } from '@material-ui/core';
import FollowersList from '@zoonk/components/FollowersList';
import Meta from '@zoonk/components/Meta';
import GroupBase from '@zoonk/components/GroupBase';
import GroupsBreadcrumb from '@zoonk/components/GroupsBreadcrumb';
import useTranslation from '@zoonk/components/useTranslation';
import { Follower, Group } from '@zoonk/models';
import { getFollowers, getGroup, getGroups } from '@zoonk/services';

interface GroupMembersProps {
  followers: Follower.Get[];
  group: Group.Get | null;
}

const limit = 10;

export const getStaticPaths: GetStaticPaths = async () => {
  const groups = await getGroups({ limit: 20 });
  const paths = groups.map((group) => ({ params: { id: group.id } }));
  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps<GroupMembersProps> = async ({
  params,
}) => {
  const doc = String(params?.id);
  const groupReq = getGroup(doc);
  const followersReq = getFollowers({ collection: 'groups', doc, limit });
  const [group, followers] = await Promise.all([groupReq, followersReq]);
  return { props: { followers, group }, revalidate: 1 };
};

const GroupMembers = ({
  followers,
  group,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const translate = useTranslation();

  const { isFallback } = useRouter();

  if (!group && isFallback) return <CircularProgress />;
  if (!group) return <Error statusCode={404} />;

  const { id, title, topics } = group;

  return (
    <Container component="main">
      <Meta title={translate('members')} noIndex />
      <GroupsBreadcrumb
        groupId={id}
        groupName={title}
        topicId={topics[0]}
        title={translate('members')}
      />
      <GroupBase group={group}>
        <FollowersList
          data={followers}
          collection="groups"
          doc={id}
          limit={limit}
        />
      </GroupBase>
    </Container>
  );
};

export default GroupMembers;
