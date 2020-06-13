import { useContext } from 'react';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import dynamic from 'next/dynamic';
import Error from 'next/error';
import { useRouter } from 'next/router';
import { CircularProgress } from '@material-ui/core';
import Meta from '@zoonk/components/Meta';
import ProfileBase from '@zoonk/components/ProfileBase';
import { Leaderboard } from '@zoonk/models';
import { getUserLeaderboard } from '@zoonk/services';
import { GlobalContext, rootUrl } from '@zoonk/utils';

const PostsCard = dynamic(() => import('@zoonk/components/PostsCard'), {
  ssr: false,
});

interface ProfileProps {
  profile: Leaderboard.Get | null;
}

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: true };
};

export const getStaticProps: GetStaticProps<ProfileProps> = async ({
  params,
}) => {
  const id = String(params?.id);
  const profile = await getUserLeaderboard(id);
  return { props: { profile }, unstable_revalidate: 1 };
};

const ProfilePage = ({
  profile,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { translate } = useContext(GlobalContext);
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
      <PostsCard userId={id} limit={10} />
    </ProfileBase>
  );
};

export default ProfilePage;
