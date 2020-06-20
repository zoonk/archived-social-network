import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';
import { CircularProgress, Container } from '@material-ui/core';
import BackButton from '@zoonk/components/BackButton';
import EditsList from '@zoonk/components/EditsList';
import Meta from '@zoonk/components/Meta';
import useTranslation from '@zoonk/components/useTranslation';
import { Activity } from '@zoonk/models';
import { getActivities } from '@zoonk/services';

const limit = 10;

interface PostEditsProps {
  postId: string;
  data: Activity.Get[];
}

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: true };
};

export const getStaticProps: GetStaticProps<PostEditsProps> = async ({
  params,
}) => {
  const postId = String(params?.id);
  const data = await getActivities(limit, `posts/${postId}`);
  return { props: { postId, data }, unstable_revalidate: 1 };
};

const PostEdits = ({
  postId,
  data,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const translate = useTranslation();
  const { isFallback } = useRouter();

  if (isFallback) return <CircularProgress />;

  return (
    <Container component="main">
      <Meta title={translate('page_edits')} noIndex />
      <BackButton />
      <EditsList data={data} itemPath={`posts/${postId}`} limit={limit} />
    </Container>
  );
};

export default PostEdits;
