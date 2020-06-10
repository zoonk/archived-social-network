import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { CircularProgress, Container } from '@material-ui/core';
import EditsBreadcrumb from '@zoonk/components/EditsBreadcrumb';
import EditsItem from '@zoonk/components/EditsItem';
import Meta from '@zoonk/components/Meta';
import { Activity } from '@zoonk/models';
import { getActivity } from '@zoonk/services';
import { GlobalContext } from '@zoonk/utils';

const EditPage = () => {
  const { translate } = useContext(GlobalContext);
  const { query } = useRouter();
  const [activity, setActivity] = useState<Activity.Get>();

  useEffect(() => {
    if (query.id) {
      getActivity(String(query.id)).then(setActivity);
    }
  }, [query]);

  return (
    <Container component="main">
      <Meta title={translate('page_edits')} noIndex />
      <EditsBreadcrumb />
      {!activity && <CircularProgress />}
      {activity && <EditsItem displayTitle edits={activity} />}
    </Container>
  );
};

export default EditPage;
