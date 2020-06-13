import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Container } from '@material-ui/core';
import GroupsBreadcrumb from '@zoonk/components/GroupsBreadcrumb';
import Meta from '@zoonk/components/Meta';
import useTranslation from '@zoonk/components/useTranslation';

const FollowersList = dynamic(() => import('@zoonk/components/FollowersList'), {
  ssr: false,
});

const GroupMembers: NextPage = () => {
  const translate = useTranslation();
  const { query } = useRouter();
  const groupId = String(query.id);

  return (
    <Container component="main">
      <Meta title={translate('members')} noIndex />
      <GroupsBreadcrumb groupId={groupId} title={translate('members')} />
      {query.id && <FollowersList groupId={groupId} />}
    </Container>
  );
};

export default GroupMembers;
