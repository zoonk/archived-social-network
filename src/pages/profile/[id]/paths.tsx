import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { Container } from '@material-ui/core';
import Meta from '@zoonk/components/Meta';
import PathsList from '@zoonk/components/PathsList';
import UserBreadcrumb from '@zoonk/components/UserBreadcrumb';
import { Profile } from '@zoonk/models';
import { getProfile } from '@zoonk/services';
import { analytics, GlobalContext, preRender, rootUrl } from '@zoonk/utils';

interface PathsProps {
  profile: Profile.Get;
}

const Paths: NextPage<PathsProps> = ({ profile }) => {
  const { translate } = useContext(GlobalContext);
  const { id, name, photo, username } = profile;

  useEffect(() => {
    analytics().setCurrentScreen('profile_paths');
  }, []);

  return (
    <Container component="main">
      <Meta
        title={translate('seo_profile_paths_title', { name })}
        description={translate('seo_profile_paths_desc')}
        image={photo}
        canonicalUrl={`${rootUrl}/profile/${username}/paths`}
      />
      <UserBreadcrumb user={profile} title={translate('learningPaths')} />
      <PathsList allowLoadMore createdById={id} />
    </Container>
  );
};

Paths.getInitialProps = async ({ query }) => {
  const username = String(query.id);
  const profile = await getProfile(username);
  preRender();

  return { profile };
};

export default Paths;
