import * as Diff from 'diff';
import { Box } from '@material-ui/core';
import { theme } from '@zoonk/utils';

interface EditsDiffBoxProps {
  changes: Diff.Change[];
}

/**
 * Display a box for showing changes to some content.
 */
const EditsDiffBox = ({ changes }: EditsDiffBoxProps) => {
  return (
    <Box style={{ padding: theme.spacing(1) }}>
      {changes.map((word, index) => {
        let backgroundColor = 'transparent';

        if (word.removed) {
          backgroundColor = '#fdb8c0';
        }

        if (word.added) {
          backgroundColor = '#acf2bd';
        }

        return (
          <span
            // eslint-disable-next-line react/no-array-index-key
            key={`${index}-${word.value}`}
            style={{
              backgroundColor,
              padding: '0 4px',
              textDecoration: word.removed ? 'line-through' : 'none',
            }}
          >
            {word.value}
          </span>
        );
      })}
    </Box>
  );
};

export default EditsDiffBox;
