import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';
import { CircularProgress, Container } from '@material-ui/core';
import EditsList from '@zoonk/components/EditsList';
import Meta from '@zoonk/components/Meta';
import TopicsBreadcrumb from '@zoonk/components/TopicsBreadcrumb';
import useTranslation from '@zoonk/components/useTranslation';
import { Activity } from '@zoonk/models';
import { getActivities } from '@zoonk/services';

const limit = 10;

interface TopicEditsProps {
  topicId: string;
  data: Activity.Get[];
}

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: true };
};

export const getStaticProps: GetStaticProps<TopicEditsProps> = async ({
  params,
}) => {
  const topicId = String(params?.id);
  const data = await getActivities(limit, `topics/${topicId}`);
  return { props: { topicId, data }, revalidate: 1 };
};

const TopicEdits = ({
  topicId,
  data,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const translate = useTranslation();
  const { isFallback } = useRouter();

  if (isFallback) return <CircularProgress />;

  return (
    <Container component="main">
      <Meta title={translate('page_edits')} noIndex />
      <TopicsBreadcrumb topicId={topicId} title={translate('see_all_edits')} />
      <EditsList data={data} itemPath={`topics/${topicId}`} limit={limit} />
    </Container>
  );
};

export default TopicEdits;
