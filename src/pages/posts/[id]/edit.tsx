import { useContext } from 'react';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Container } from '@material-ui/core';
import Meta from '@zoonk/components/Meta';
import { GlobalContext } from '@zoonk/utils';

const PostEdit = dynamic(() => import('@zoonk/components/PostEdit'), {
  ssr: false,
});

const EditPost: NextPage = () => {
  const { translate } = useContext(GlobalContext);
  const { query } = useRouter();

  return (
    <Container component="main">
      <Meta title={translate('post_edit')} />
      {query.id && <PostEdit id={String(query.id)} />}
    </Container>
  );
};

export default EditPost;
