import { Activity, FieldDiff } from '@zoonk/models';
import { Typography } from '@material-ui/core';
import EditsDiffBox from './EditsDiffBox';
import EditsField from './EditsField';

interface EditsAfterProps {
  edits: Activity.Get;
  items: FieldDiff[];
}

/**
 * Previous item state.
 */
const EditsAfter = ({ edits, items }: EditsAfterProps) => {
  return (
    <EditsDiffBox type="after">
      {edits.action === 'deleted' && <Typography color="error">---</Typography>}

      {edits.action !== 'deleted' &&
        items.map((item) => (
          <EditsField item={item} key={`${item.field}-${item.value}`} />
        ))}
    </EditsDiffBox>
  );
};

export default EditsAfter;
