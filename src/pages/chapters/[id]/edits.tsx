import { useContext } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Container } from '@material-ui/core';
import ChaptersBreadcrumb from '@zoonk/components/ChaptersBreadcrumb';
import EditsList from '@zoonk/components/EditsList';
import Meta from '@zoonk/components/Meta';
import { GlobalContext } from '@zoonk/utils';

const ChapterEdits: NextPage = () => {
  const { translate } = useContext(GlobalContext);
  const { query } = useRouter();

  if (!query.id) return null;

  return (
    <Container component="main">
      <Meta title={translate('page_edits')} noIndex />
      <ChaptersBreadcrumb
        chapterId={String(query.id)}
        title={translate('chapter')}
        page={translate('page_edits')}
      />
      <EditsList itemPath={`chapters/${query.id}`} />
    </Container>
  );
};

export default ChapterEdits;
