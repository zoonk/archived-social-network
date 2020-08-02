import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import Error from 'next/error';
import { useRouter } from 'next/router';
import { CircularProgress } from '@material-ui/core';
import Meta from '@zoonk/components/Meta';
import PostsList from '@zoonk/components/PostsList';
import ProfileBase from '@zoonk/components/ProfileBase';
import useTranslation from '@zoonk/components/useTranslation';
import { Leaderboard, Post } from '@zoonk/models';
import { getPosts, getUserLeaderboard } from '@zoonk/services';
import { rootUrl } from '@zoonk/utils';

interface ProfileProps {
  posts: Post.Get[];
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
  const posts = await getPosts({ userId: profile?.id, limit });
  return { props: { posts, profile }, revalidate: 1 };
};

const ProfilePage = ({
  posts,
  profile,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const translate = useTranslation();
  const { isFallback } = useRouter();

  if (!profile && isFallback) return <CircularProgress />;
  if (!profile) return <Error statusCode={404} />;

  const { id, name, photo, username } = profile;

  return (
    <ProfileBase profile={profile}>
      <Meta
        title={name}
        description={translate('seo_profile_desc', { name })}
        image={photo}
        canonicalUrl={`${rootUrl}/profile/${username}`}
      />
      <PostsList data={posts} userId={id} limit={limit} />
    </ProfileBase>
  );
};

export default ProfilePage;
