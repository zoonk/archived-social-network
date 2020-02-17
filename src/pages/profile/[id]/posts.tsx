import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { Container } from '@material-ui/core';
import Meta from '@zoonk/components/Meta';
import PostsCard from '@zoonk/components/PostsCard';
import UserBreadcrumb from '@zoonk/components/UserBreadcrumb';
import { Profile } from '@zoonk/models';
import { getProfile } from '@zoonk/services';
import { analytics, GlobalContext, preRender, rootUrl } from '@zoonk/utils';

interface PostsProps {
  profile: Profile.Get;
}

const Posts: NextPage<PostsProps> = ({ profile }) => {
  const { translate } = useContext(GlobalContext);
  const { id, name, photo, username } = profile;

  useEffect(() => {
    analytics().setCurrentScreen('profile_posts');
  }, []);

  return (
    <Container component="main">
      <Meta
        title={translate('seo_profile_posts_title', { name })}
        description={translate('seo_profile_posts_desc', { name })}
        image={photo}
        canonicalUrl={`${rootUrl}/profile/${username}/posts`}
      />
      <UserBreadcrumb user={profile} title={translate('posts')} />
      <PostsCard
        allowLoadMore
        hideLink
        limit={10}
        title={translate('posts')}
        userId={id}
      />
    </Container>
  );
};

Posts.getInitialProps = async ({ query }) => {
  const username = String(query.id);
  const profile = await getProfile(username);
  preRender();
  return { profile };
};

export default Posts;
