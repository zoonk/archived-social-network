import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Container } from '@material-ui/core';
import ChaptersBreadcrumb from '@zoonk/components/ChaptersBreadcrumb';
import EditsList from '@zoonk/components/EditsList';
import Meta from '@zoonk/components/Meta';
import { analytics, GlobalContext } from '@zoonk/utils';

const ChapterEdits: NextPage = () => {
  const { translate } = useContext(GlobalContext);
  const { query } = useRouter();

  useEffect(() => {
    analytics().setCurrentScreen('chapter_edits');
  }, []);

  return (
    <Container component="main">
      <Meta title={translate('page_edits')} noIndex />
      <ChaptersBreadcrumb
        title={translate('chapter')}
        page={translate('page_edits')}
      />
      {query.chapterId && (
        <EditsList
          itemPath={`chapters/${query.chapterId}`}
          editLink={{
            href: '/topics/[id]/chapters/[chapterId]/edit',
            as: `/topics/${query.id}/chapters/${query.chapterId}/edit`,
          }}
        />
      )}
    </Container>
  );
};

export default ChapterEdits;
