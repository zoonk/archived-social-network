import { Activity, FieldDiff } from '@zoonk/models';
import { Typography } from '@material-ui/core';
import EditsDiffBox from './EditsDiffBox';
import EditsField from './EditsField';

interface EditsBeforeProps {
  edits: Activity.Get;
  items: FieldDiff[];
}

/**
 * Previous item state.
 */
const EditsBefore = ({ edits, items }: EditsBeforeProps) => {
  return (
    <EditsDiffBox type="before">
      {edits.action === 'created' && <Typography color="error">---</Typography>}

      {edits.action !== 'created' &&
        items.map((item) => (
          <EditsField item={item} key={`${item.field}-${item.value}`} />
        ))}
    </EditsDiffBox>
  );
};

export default EditsBefore;
