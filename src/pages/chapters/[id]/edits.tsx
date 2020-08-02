import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';
import { CircularProgress, Container } from '@material-ui/core';
import ChaptersBreadcrumb from '@zoonk/components/ChaptersBreadcrumb';
import EditsList from '@zoonk/components/EditsList';
import Meta from '@zoonk/components/Meta';
import useTranslation from '@zoonk/components/useTranslation';
import { Activity } from '@zoonk/models';
import { getActivities } from '@zoonk/services';

const limit = 10;

interface ChapterEditsProps {
  chapterId: string;
  data: Activity.Get[];
}

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: true };
};

export const getStaticProps: GetStaticProps<ChapterEditsProps> = async ({
  params,
}) => {
  const chapterId = String(params?.id);
  const data = await getActivities(limit, `chapters/${chapterId}`);
  return { props: { chapterId, data }, revalidate: 1 };
};

const ChapterEdits = ({
  chapterId,
  data,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const translate = useTranslation();
  const { isFallback } = useRouter();

  if (isFallback) return <CircularProgress />;

  return (
    <Container component="main">
      <Meta title={translate('page_edits')} noIndex />
      <ChaptersBreadcrumb
        chapterId={chapterId}
        title={translate('chapter')}
        page={translate('page_edits')}
      />
      <EditsList data={data} itemPath={`chapters/${chapterId}`} limit={limit} />
    </Container>
  );
};

export default ChapterEdits;
