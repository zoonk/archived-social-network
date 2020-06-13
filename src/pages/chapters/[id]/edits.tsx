import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Container } from '@material-ui/core';
import ChaptersBreadcrumb from '@zoonk/components/ChaptersBreadcrumb';
import Meta from '@zoonk/components/Meta';
import useTranslation from '@zoonk/components/useTranslation';

const EditsList = dynamic(() => import('@zoonk/components/EditsList'), {
  ssr: false,
});

const ChapterEdits: NextPage = () => {
  const translate = useTranslation();
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
