import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Container } from '@material-ui/core';
import ChaptersBreadcrumb from '@zoonk/components/ChaptersBreadcrumb';
import EditsList from '@zoonk/components/EditsList';
import LinkChapter from '@zoonk/components/LinkChapter';
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

      <ChaptersBreadcrumb title={translate('see_all_edits')}>
        <LinkChapter
          title={translate('chapter')}
          chapterId={String(query.id)}
        />
      </ChaptersBreadcrumb>

      {query.id && <EditsList itemPath={`chapters/${query.id}`} />}
    </Container>
  );
};

export default ChapterEdits;
