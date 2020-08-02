import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import Error from 'next/error';
import { useRouter } from 'next/router';
import { CircularProgress } from '@material-ui/core';
import DiscussionList from '@zoonk/components/DiscussionList';
import Meta from '@zoonk/components/Meta';
import ProfileBase from '@zoonk/components/ProfileBase';
import { Comment, Leaderboard } from '@zoonk/models';
import { getComments, getUserLeaderboard } from '@zoonk/services';
import { rootUrl } from '@zoonk/utils';

interface ProfileProps {
  comments: Comment.Get[];
  profile: Leaderboard.Get | null;
}

const limit = 10;

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: true };
};

export const getStaticProps: GetStaticProps<ProfileProps> = async ({
  params,
}) => {
  const id = String(params?.id);
  const profile = await getUserLeaderboard(id);
  const comments = await getComments(limit, profile?.id);
  return { props: { comments, profile }, revalidate: 1 };
};

const ProfileComments = ({
  comments,
  profile,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { isFallback } = useRouter();

  if (!profile && isFallback) return <CircularProgress />;
  if (!profile) return <Error statusCode={404} />;

  const { id, name, photo, username } = profile;

  return (
    <ProfileBase profile={profile}>
      <Meta
        title={name}
        image={photo}
        canonicalUrl={`${rootUrl}/profile/${username}`}
        noIndex
      />
      <DiscussionList data={comments} userId={id} limit={limit} />
    </ProfileBase>
  );
};

export default ProfileComments;
