import { useContext } from 'react';
import { Typography } from '@material-ui/core';
import { FieldDiff } from '@zoonk/models';
import { GlobalContext } from '@zoonk/utils';

interface EditsFieldProps {
  item: FieldDiff;
}

/**
 * Display a changed field in the edits page.
 */
const EditsField = ({ item }: EditsFieldProps) => {
  const { translate } = useContext(GlobalContext);

  return (
    <Typography
      key={`${item.field}-${item.value}`}
      style={{ wordBreak: 'break-word' }}
    >
      <strong>{(translate as any)[item.field] || item.field}</strong>:{' '}
      {String(item.value)}
    </Typography>
  );
};

export default EditsField;
