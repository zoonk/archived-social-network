import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { Container } from '@material-ui/core';
import EditsList from '@zoonk/components/EditsList';
import Meta from '@zoonk/components/Meta';
import SidebarPage from '@zoonk/components/SidebarPage';
import useTranslation from '@zoonk/components/useTranslation';
import { Activity } from '@zoonk/models';
import { getActivities } from '@zoonk/services';

const limit = 10;

interface EditsProps {
  data: Activity.Get[];
}

export const getStaticProps: GetStaticProps<EditsProps> = async () => {
  const data = await getActivities(limit);
  return { props: { data }, revalidate: 1 };
};

const Edits = ({ data }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const translate = useTranslation();

  return (
    <Container component="main">
      <Meta
        title={translate('edit_history')}
        description={translate('seo_edits_desc')}
        noIndex
      />
      <SidebarPage title={translate('post_share')}>
        <div>
          <EditsList data={data} displayTitle limit={limit} />
        </div>
      </SidebarPage>
    </Container>
  );
};

export default Edits;
