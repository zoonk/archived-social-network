import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';
import { CircularProgress, Container } from '@material-ui/core';
import EditsList from '@zoonk/components/EditsList';
import GroupsBreadcrumb from '@zoonk/components/GroupsBreadcrumb';
import Meta from '@zoonk/components/Meta';
import useTranslation from '@zoonk/components/useTranslation';
import { Activity } from '@zoonk/models';
import { getActivities } from '@zoonk/services';

const limit = 10;

interface GroupEditsProps {
  groupId: string;
  data: Activity.Get[];
}

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: true };
};

export const getStaticProps: GetStaticProps<GroupEditsProps> = async ({
  params,
}) => {
  const groupId = String(params?.id);
  const data = await getActivities(limit, `groups/${groupId}`);
  return { props: { groupId, data }, revalidate: 1 };
};

const GroupEdits = ({
  groupId,
  data,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const translate = useTranslation();
  const { isFallback } = useRouter();

  if (isFallback) return <CircularProgress />;

  return (
    <Container component="main">
      <Meta title={translate('page_edits')} noIndex />
      <GroupsBreadcrumb groupId={groupId} title={translate('see_all_edits')} />
      <EditsList data={data} itemPath={`groups/${groupId}`} limit={limit} />
    </Container>
  );
};

export default GroupEdits;
