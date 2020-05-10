import { useContext, useEffect, useState } from 'react';
import NextLink from 'next/link';
import {
  Button,
  Divider,
  ExpansionPanel,
  ExpansionPanelActions,
  ExpansionPanelDetails,
} from '@material-ui/core';
import * as Diff from 'diff';
import { isEqual } from 'lodash';
import { Activity } from '@zoonk/models';
import { editableFields, getFieldDiff, GlobalContext } from '@zoonk/utils';
import EditsDiffBox from './EditsDiffBox';
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
 */
const EditsItem = ({ displayTitle, edits }: EditsItemProps) => {
  const { translate } = useContext(GlobalContext);
  const [changes, setChanges] = useState<Diff.Change[][]>([[]]);
  const hrefLink = `/${edits.category}/[id]/edit`;
  const asLink = `/${edits.itemPath}/edit`;

  useEffect(() => {
    const changedFields = editableFields[edits.category].filter((field) => {
      const before = (edits.before as any)?.[field];
      const after = (edits.after as any)?.[field];
      return !isEqual(before, after);
    });

    const fields = changedFields.map((field) => {
      const before = (edits.before as any)?.[field];
      const after = (edits.after as any)?.[field];
      return getFieldDiff(before, after);
    });

    setChanges(fields);
  }, [edits]);

  return (
    <ExpansionPanel>
      <EditsHeader displayTitle={displayTitle} item={edits} />
      <ExpansionPanelDetails style={{ display: 'block' }}>
        {changes.map((change, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <EditsDiffBox changes={change} key={index} />
        ))}
      </ExpansionPanelDetails>

      <Divider />

      <ExpansionPanelActions style={{ justifyContent: 'space-between' }}>
        <NextLink href={hrefLink} as={asLink} passHref>
          <Button component="a" color="primary">
            {translate('edit')}
          </Button>
        </NextLink>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <EditsReport id={edits.id} />
          <EditsRevert edits={edits} />
        </div>
      </ExpansionPanelActions>
    </ExpansionPanel>
  );
};

export default EditsItem;
