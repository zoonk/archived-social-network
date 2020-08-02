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

interface GroupReferencesProps {
  references: Post.Get[];
  group: Group.Get | null;
}

const limit = 10;

export const getStaticPaths: GetStaticPaths = async () => {
  const groups = await getGroups({ limit: 20 });
  const paths = groups.map((group) => ({ params: { id: group.id } }));
  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps<GroupReferencesProps> = async ({
  params,
}) => {
  const groupId = String(params?.id);
  const groupReq = getGroup(groupId);
  const referencesReq = getPosts({ category: ['references'], groupId, limit });
  const [group, references] = await Promise.all([groupReq, referencesReq]);
  return { props: { references, group }, revalidate: 1 };
};

const GroupReferences = ({
  references,
  group,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const translate = useTranslation();

  const { isFallback } = useRouter();

  if (!group && isFallback) return <CircularProgress />;
  if (!group) return <Error statusCode={404} />;

  const { id, language, photo, title, topics } = group;

  return (
    <Container component="main">
      <Meta
        title={translate('seo_topic_ref_title', { title })}
        description={translate('seo_topic_ref_desc', { title })}
        image={photo}
        canonicalUrl={`https://${language}.zoonk.org/groups/${id}/references`}
      />
      <GroupsBreadcrumb
        groupId={id}
        groupName={title}
        topicId={topics[0]}
        title={translate('references')}
      />
      <GroupBase group={group}>
        <PostShare
          category="references"
          title={translate('teach_ref_title')}
          groupId={id}
        />
        <PostsList
          data={references}
          category={['references']}
          groupId={id}
          limit={10}
        />
      </GroupBase>
    </Container>
  );
};

export default GroupReferences;
