import { useContext, useEffect, useState } from 'react';
import NextLink from 'next/link';
import {
  Button,
  Divider,
  ExpansionPanel,
  ExpansionPanelActions,
  ExpansionPanelDetails,
  Grid,
} from '@material-ui/core';
import { pick } from 'lodash';
import { Activity, FieldDiff } from '@zoonk/models';
import { editableFields, getObjDiff, GlobalContext } from '@zoonk/utils';
import EditsAfter from './EditsAfter';
import EditsBefore from './EditsBefore';
import EditsHeader from './EditsHeader';
import EditsReport from './EditsReport';
import EditsRevert from './EditsRevert';

interface EditsItemProps {
  displayTitle?: boolean;
  edits: Activity.Get;
}

/**
 * Expansion panel containing a comparison between changes (`before` and `after`)
 * made to an item.
 *
 * @property `displayTitle` - set to `true` if the item's title should be displayed.
 * @property `edits` - serialized data returned from the backend.
 */
const EditsItem = ({ displayTitle, edits }: EditsItemProps) => {
  const { translate } = useContext(GlobalContext);
  const [added, setAdded] = useState<FieldDiff[]>([]);
  const [removed, setRemoved] = useState<FieldDiff[]>([]);

  useEffect(() => {
    const beforeData = edits.action !== 'created' ? edits.before : {};
    const afterData = edits.action !== 'deleted' ? edits.after : {};
    const beforeFields = pick(beforeData, editableFields[edits.category]);
    const afterFields = pick(afterData, editableFields[edits.category]);
    const diff = getObjDiff(beforeFields, afterFields);

    setAdded(diff.after);
    setRemoved(diff.before);
  }, [edits]);

  return (
    <ExpansionPanel>
      <EditsHeader displayTitle={displayTitle} item={edits} />
      <ExpansionPanelDetails>
        <Grid container spacing={0}>
          <Grid item xs={12} sm={6}>
            <EditsBefore edits={edits} items={removed} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <EditsAfter edits={edits} items={added} />
          </Grid>
        </Grid>
      </ExpansionPanelDetails>

      <Divider />

      <ExpansionPanelActions style={{ justifyContent: 'space-between' }}>
        <NextLink
          href={`/${edits.category}/[id]/edit`}
          as={`/${edits.itemPath}/edit`}
          passHref
        >
          <Button component="a" color="primary">
            {translate('edit')}
          </Button>
        </NextLink>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <EditsReport added={added} id={edits.id} removed={removed} />
          <EditsRevert edits={edits} />
        </div>
      </ExpansionPanelActions>
    </ExpansionPanel>
  );
};

export default EditsItem;
