import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { Container } from '@material-ui/core';
import DiscussionList from '@zoonk/components/DiscussionList';
import Meta from '@zoonk/components/Meta';
import SidebarPage from '@zoonk/components/SidebarPage';
import useTranslation from '@zoonk/components/useTranslation';
import { Comment } from '@zoonk/models';
import { getComments } from '@zoonk/services';

interface CommentsProps {
  data: Comment.Get[];
}

export const getStaticProps: GetStaticProps<CommentsProps> = async () => {
  const data = await getComments();
  return { props: { data }, revalidate: 1 };
};

const Comments = ({ data }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const translate = useTranslation();

  return (
    <Container component="main">
      <Meta title={translate('comments')} noIndex />
      <SidebarPage title={translate('post_share')}>
        <DiscussionList data={data} />
      </SidebarPage>
    </Container>
  );
};

export default Comments;
