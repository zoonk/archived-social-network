import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Container } from '@material-ui/core';
import EditsList from '@zoonk/components/EditsList';
import Meta from '@zoonk/components/Meta';
import TopicsBreadcrumb from '@zoonk/components/TopicsBreadcrumb';
import { analytics, getPageTitle, GlobalContext, rootUrl } from '@zoonk/utils';

const TopicEdits: NextPage = () => {
  const { query } = useRouter();
  const { translate } = useContext(GlobalContext);
  const id = String(query.id);
  const title = getPageTitle(id);

  useEffect(() => {
    analytics().setCurrentScreen('topic_edits');
  }, []);

  return (
    <Container component="main">
      <Meta
        title={`${translate('page_edits_title')} ${title}`}
        canonicalUrl={`${rootUrl}/topics/${id}/edits`}
        noIndex
      />

      <TopicsBreadcrumb topicId={id} title={translate('see_all_edits')} />
      {query.id && <EditsList itemPath={`topics/${id}`} />}
    </Container>
  );
};

export default TopicEdits;
