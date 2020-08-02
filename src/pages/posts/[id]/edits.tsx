import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import Error from 'next/error';
import { useRouter } from 'next/router';
import { CircularProgress, Container } from '@material-ui/core';
import EditsList from '@zoonk/components/EditsList';
import Meta from '@zoonk/components/Meta';
import PostsBreadcrumb from '@zoonk/components/PostsBreadcrumb';
import useTranslation from '@zoonk/components/useTranslation';
import { Activity, Post } from '@zoonk/models';
import { getActivities, getPost } from '@zoonk/services';

const limit = 10;

interface PostEditsProps {
  edits: Activity.Get[];
  post: Post.Get | null;
}

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: true };
};

export const getStaticProps: GetStaticProps<PostEditsProps> = async ({
  params,
}) => {
  const postId = String(params?.id);
  const editsReq = getActivities(limit, `posts/${postId}`);
  const postReq = getPost(postId);
  const [edits, post] = await Promise.all([editsReq, postReq]);
  return { props: { edits, post }, revalidate: 1 };
};

const PostEdits = ({
  edits,
  post,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const translate = useTranslation();
  const { isFallback } = useRouter();

  if (isFallback) return <CircularProgress />;
  if (!post) return <Error statusCode={404} />;

  const {
    chapterId,
    chapterData,
    groupId,
    groupData,
    id,
    title,
    topics,
  } = post;

  return (
    <Container component="main">
      <Meta title={translate('page_edits')} noIndex />
      <PostsBreadcrumb
        chapterId={chapterId}
        chapterName={chapterData?.title}
        groupId={groupId}
        groupName={groupData?.title}
        postId={id}
        postTitle={title}
        title={translate('page_edits')}
        topicId={topics[0]}
      />
      <EditsList data={edits} itemPath={`posts/${id}`} limit={limit} />
    </Container>
  );
};

export default PostEdits;
