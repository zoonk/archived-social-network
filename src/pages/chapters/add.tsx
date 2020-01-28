import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Container, Typography } from '@material-ui/core';
import ChapterCreate from '@zoonk/components/ChapterCreate';
import ChapterFormContainer from '@zoonk/components/ChapterFormContainer';
import LinkPath from '@zoonk/components/LinkPath';
import Meta from '@zoonk/components/Meta';
import PathsBreadcrumb from '@zoonk/components/PathsBreadcrumb';
import { analytics, GlobalContext } from '@zoonk/utils';

const ChapterAdd: NextPage = () => {
  const { translate } = useContext(GlobalContext);
  const { query } = useRouter();
  const pathId = String(query.pathId);

  useEffect(() => {
    analytics().setCurrentScreen('chapters_add');
  }, []);

  useEffect(() => {
    if (!query.pathId) {
      analytics().logEvent('exception', {
        description: 'invalid_id',
        action: 'chapter_add',
      });
    }
  }, [query.pathId]);

  if (!query.pathId) {
    return <Typography>{translate('chapter_invalid_id')}</Typography>;
  }

  return (
    <Container component="main" maxWidth="xs">
      <Meta title={translate('chapter_add')} noIndex />
      <PathsBreadcrumb title={translate('chapter_add')}>
        <LinkPath id={pathId} title={translate('current_item')} />
      </PathsBreadcrumb>
      <ChapterFormContainer>
        <ChapterCreate pathId={pathId} />
      </ChapterFormContainer>
    </Container>
  );
};

export default ChapterAdd;
