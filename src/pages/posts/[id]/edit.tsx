import { useContext, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { CircularProgress, Container } from '@material-ui/core';
import EditNotAllowed from '@zoonk/components/EditNotAllowed';
import LinkPost from '@zoonk/components/LinkPost';
import LoginForm from '@zoonk/components/LoginForm';
import Meta from '@zoonk/components/Meta';
import PostEdit from '@zoonk/components/PostEdit';
import PostsBreadcrumb from '@zoonk/components/PostsBreadcrumb';
import Snackbar from '@zoonk/components/Snackbar';
import { Post, SnackbarAction } from '@zoonk/models';
import { getPost } from '@zoonk/services';
import { analytics, firebaseError, GlobalContext } from '@zoonk/utils';

const EditPost: NextPage = () => {
  const { translate, user } = useContext(GlobalContext);
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);
  const [data, setData] = useState<Post.Get>();
  const { query } = useRouter();
  const isAuthor = user?.uid === data?.createdById;
  const isPost = data?.category === 'posts';
  const isQuestion = data?.category === 'questions';
  const isEditable = !isPost && !isQuestion;

  useEffect(() => {
    analytics().setCurrentScreen('post_edit');
  }, []);

  useEffect(() => {
    if (query.id) {
      getPost(String(query.id))
        .then(setData)
        .catch((e) => setSnackbar(firebaseError(e, 'post_get')));
    }
  }, [query.id]);

  if (user === null) {
    return <LoginForm />;
  }

  if (!data || user === undefined) {
    return <CircularProgress />;
  }

  if (!isAuthor && !isEditable) {
    return <EditNotAllowed />;
  }

  return (
    <Container component="main">
      <Meta title={translate('post_edit')} />
      <PostsBreadcrumb
        category={data.category}
        chapterId={data.chapters[0]}
        topicId={data.topics[0]}
        title={translate('edit')}
      >
        <LinkPost title={data.title} id={data.id} />
      </PostsBreadcrumb>
      <PostEdit data={data} />
      <Snackbar action={snackbar} />
    </Container>
  );
};

export default EditPost;
