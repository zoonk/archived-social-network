import { useContext } from 'react';
import { useRouter } from 'next/router';
import { GlobalContext, getPageTitle, theme } from '@zoonk/utils';
import EditorView from './EditorView';

/**
 * Display a message when no chapters are found for a request.
 */
const NoChapters = () => {
  const { translate } = useContext(GlobalContext);
  const { query } = useRouter();
  const id = String(query.id);
  const title = getPageTitle(id);

  return (
    <div style={{ margin: theme.spacing(2, 0) }}>
      <EditorView content={translate('no_chapters', { title, id })} />
    </div>
  );
};

export default NoChapters;
