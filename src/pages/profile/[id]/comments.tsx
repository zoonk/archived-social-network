import { useContext, useEffect } from 'react';
import { NextPage, NextPageContext } from 'next';
import DiscussionList from '@zoonk/components/DiscussionList';
import Meta from '@zoonk/components/Meta';
import ProfileBase from '@zoonk/components/ProfileBase';
import { Leaderboard } from '@zoonk/models';
import { getUserLeaderboard } from '@zoonk/services';
import { analytics, GlobalContext, preRender, rootUrl } from '@zoonk/utils';

interface ProfileProps {
  profile: Leaderboard.Get;
}

const ProfilePage: NextPage<ProfileProps> = ({ profile }: ProfileProps) => {
  const { translate } = useContext(GlobalContext);
  const { id, name, photo, username } = profile;

  useEffect(() => {
    analytics().setCurrentScreen('profile_comments');
  }, []);

  return (
    <ProfileBase profile={profile}>
      <Meta
        title={name}
        description={translate('seo_profile_desc', { name })}
        image={photo}
        canonicalUrl={`${rootUrl}/profile/${username}`}
        noIndex
      />
      <DiscussionList createdById={id} limit={10} allowLoadMore />
    </ProfileBase>
  );
};

ProfilePage.getInitialProps = async ({ query }: NextPageContext) => {
  const profile = await getUserLeaderboard(String(query.id));
  preRender();
  return { profile };
};

export default ProfilePage;
