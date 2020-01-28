import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { Container } from '@material-ui/core';
import Meta from '@zoonk/components/Meta';
import TopicList from '@zoonk/components/TopicList';
import UserBreadcrumb from '@zoonk/components/UserBreadcrumb';
import { Profile } from '@zoonk/models';
import { getProfile } from '@zoonk/services';
import { analytics, GlobalContext, preRender, rootUrl } from '@zoonk/utils';

interface TopicsProps {
  profile: Profile.Get;
}

const Topics: NextPage<TopicsProps> = ({ profile }) => {
  const { translate } = useContext(GlobalContext);
  const { id, name, photo, username } = profile;

  useEffect(() => {
    analytics().setCurrentScreen('profile_topics');
  }, []);

  return (
    <Container component="main">
      <Meta
        title={translate('seo_profile_topics_title', { name })}
        description={translate('seo_profile_topics_desc')}
        image={photo}
        canonicalUrl={`${rootUrl}/profile/${username}/topics`}
      />
      <UserBreadcrumb user={profile} title={translate('topics')} />
      <TopicList allowLoadMore createdById={id} />
    </Container>
  );
};

Topics.getInitialProps = async ({ query }) => {
  const username = String(query.id);
  const profile = await getProfile(username);
  preRender();

  return { profile };
};

export default Topics;
