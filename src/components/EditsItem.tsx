import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
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
import { editableFields } from '@zoonk/utils';
import { getFieldDiff } from '@zoonk/utils/diff';
import EditsDiffBox from './EditsDiffBox';
import EditsHeader from './EditsHeader';
import { getPlainText } from './rich-text/posts';
import useTranslation from './useTranslation';

const EditsReport = dynamic(() => import('./EditsReport'), { ssr: false });
const EditsRevert = dynamic(() => import('./EditsRevert'), { ssr: false });

interface EditsItemProps {
  displayTitle?: boolean;
  edits: Activity.Get;
}

/**
 * Expansion panel containing a comparison between changes (`before` and `after`)
 * made to an item.
 */
const EditsItem = ({ displayTitle, edits }: EditsItemProps) => {
  const translate = useTranslation();
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
      let before = (edits.before as any)?.[field];
      let after = (edits.after as any)?.[field];

      if (edits.category === 'posts' && field === 'content') {
        before = getPlainText(JSON.parse(before || '[]'));
        after = getPlainText(JSON.parse(after || '[]'));
      }

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
