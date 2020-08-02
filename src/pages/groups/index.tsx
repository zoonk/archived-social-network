import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { Container } from '@material-ui/core';
import GroupList from '@zoonk/components/GroupList';
import GroupListHeader from '@zoonk/components/GroupListHeader';
import Meta from '@zoonk/components/Meta';
import SidebarPage from '@zoonk/components/SidebarPage';
import useTranslation from '@zoonk/components/useTranslation';
import { Group } from '@zoonk/models';
import { getGroups } from '@zoonk/services';
import { rootUrl } from '@zoonk/utils';

const limit = 10;

interface GroupsProps {
  data: Group.Get[];
}

export const getStaticProps: GetStaticProps<GroupsProps> = async () => {
  const data = await getGroups({ limit });
  return { props: { data }, revalidate: 1 };
};

const Groups = ({ data }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const translate = useTranslation();

  return (
    <Container component="main">
      <Meta
        title={translate('groups')}
        description={translate('seo_groups_desc')}
        canonicalUrl={`${rootUrl}/groups`}
      />
      <SidebarPage title={translate('post_share')}>
        <GroupListHeader active="all" />
        <GroupList data={data} limit={limit} />
      </SidebarPage>
    </Container>
  );
};

export default Groups;
