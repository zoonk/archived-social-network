import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Container } from '@material-ui/core';
import ChapterSortableList from '@zoonk/components/ChapterSortableList';
import LinkPath from '@zoonk/components/LinkPath';
import Meta from '@zoonk/components/Meta';
import PathsBreadcrumb from '@zoonk/components/PathsBreadcrumb';
import { analytics, GlobalContext } from '@zoonk/utils';

const PathChapters: NextPage = () => {
  const { translate } = useContext(GlobalContext);
  const { query } = useRouter();

  useEffect(() => {
    analytics().setCurrentScreen('path_chapters');
  }, []);

  return (
    <Container component="main">
      <Meta title={translate('chapters')} noIndex />
      <PathsBreadcrumb title={translate('chapters')}>
        <LinkPath id={String(query.id)} title={translate('selected_item')} />
      </PathsBreadcrumb>
      {query.id && <ChapterSortableList pathId={String(query.id)} />}
    </Container>
  );
};

export default PathChapters;
