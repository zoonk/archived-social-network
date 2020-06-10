import { useContext } from 'react';
import { NextPage, NextPageContext } from 'next';
import Meta from '@zoonk/components/Meta';
import PostsCard from '@zoonk/components/PostsCard';
import ProfileBase from '@zoonk/components/ProfileBase';
import { Leaderboard } from '@zoonk/models';
import { getUserLeaderboard } from '@zoonk/services';
import { GlobalContext, preRender, rootUrl } from '@zoonk/utils';

interface ProfileProps {
  profile: Leaderboard.Get;
}

const ProfilePage: NextPage<ProfileProps> = ({ profile }: ProfileProps) => {
  const { translate } = useContext(GlobalContext);
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

ProfilePage.getInitialProps = async ({ query }: NextPageContext) => {
  const profile = await getUserLeaderboard(String(query.id));
  preRender();
  return { profile };
};

export default ProfilePage;
