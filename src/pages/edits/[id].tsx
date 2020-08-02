import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import Error from 'next/error';
import { useRouter } from 'next/router';
import { CircularProgress, Container } from '@material-ui/core';
import EditsBreadcrumb from '@zoonk/components/EditsBreadcrumb';
import EditsItem from '@zoonk/components/EditsItem';
import Meta from '@zoonk/components/Meta';
import useTranslation from '@zoonk/components/useTranslation';
import { Activity } from '@zoonk/models';
import { getActivity } from '@zoonk/services';

interface EditProps {
  data: Activity.Get | null;
}

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: true };
};

export const getStaticProps: GetStaticProps<EditProps> = async ({ params }) => {
  const id = String(params?.id);
  const data = await getActivity(id);
  return { props: { data }, revalidate: 1 };
};

const Edit = ({ data }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const translate = useTranslation();
  const { isFallback } = useRouter();

  if (!data && isFallback) return <CircularProgress />;
  if (!data) return <Error statusCode={404} />;

  return (
    <Container component="main">
      <Meta title={translate('page_edits')} noIndex />
      <EditsBreadcrumb />
      <EditsItem displayTitle edits={data} />
    </Container>
  );
};

export default Edit;
