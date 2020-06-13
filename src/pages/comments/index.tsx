import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { Container } from '@material-ui/core';
import Meta from '@zoonk/components/Meta';
import SidebarPage from '@zoonk/components/SidebarPage';
import useTranslation from '@zoonk/components/useTranslation';

const DiscussionList = dynamic(
  () => import('@zoonk/components/DiscussionList'),
  { ssr: false },
);

const CommentsPage: NextPage = () => {
  const translate = useTranslation();

  return (
    <Container component="main">
      <Meta title={translate('comments')} noIndex />
      <SidebarPage title={translate('post_share')}>
        <DiscussionList allowLoadMore />
      </SidebarPage>
    </Container>
  );
};

export default CommentsPage;
