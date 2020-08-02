import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import Error from 'next/error';
import { useRouter } from 'next/router';
import { CircularProgress, Container } from '@material-ui/core';
import PostsList from '@zoonk/components/PostsList';
import Meta from '@zoonk/components/Meta';
import GroupBase from '@zoonk/components/GroupBase';
import GroupsBreadcrumb from '@zoonk/components/GroupsBreadcrumb';
import PostShare from '@zoonk/components/PostShare';
import useTranslation from '@zoonk/components/useTranslation';
import { Group, Post } from '@zoonk/models';
import { getGroup, getGroups, getPosts } from '@zoonk/services';

interface GroupPostsProps {
  group: Group.Get | null;
  posts: Post.Get[];
}

const limit = 10;

export const getStaticPaths: GetStaticPaths = async () => {
  const groups = await getGroups({ limit: 20 });
  const paths = groups.map((group) => ({ params: { id: group.id } }));
  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps<GroupPostsProps> = async ({
  params,
}) => {
  const groupId = String(params?.id);
  const groupReq = getGroup(groupId);
  const postsReq = getPosts({ category: ['lessons', 'posts'], groupId, limit });
  const [group, posts] = await Promise.all([groupReq, postsReq]);
  return { props: { posts, group }, revalidate: 1 };
};

const GroupPosts = ({
  group,
  posts,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const translate = useTranslation();

  const { isFallback } = useRouter();

  if (!group && isFallback) return <CircularProgress />;
  if (!group) return <Error statusCode={404} />;

  const { id, language, photo, title, topics } = group;

  return (
    <Container component="main">
      <Meta
        title={translate('seo_topic_posts_title', { title })}
        description={translate('seo_topic_posts_desc', { title })}
        image={photo}
        canonicalUrl={`https://${language}.zoonk.org/groups/${id}/posts`}
      />
      <GroupsBreadcrumb
        groupId={id}
        groupName={title}
        topicId={topics[0]}
        title={translate('posts')}
      />
      <GroupBase group={group}>
        <PostShare category="posts" groupId={id} />
        <PostsList
          data={posts}
          category={['lessons', 'posts']}
          groupId={id}
          limit={10}
        />
      </GroupBase>
    </Container>
  );
};

export default GroupPosts;
