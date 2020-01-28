import { useContext } from 'react';
import { Box, Typography } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import { GlobalContext, theme } from '@zoonk/utils';

interface EditsDiffBoxProps {
  children: React.ReactNode;
  type: 'after' | 'before';
}

/**
 * Display a box for showing changes to some content.
 */
const EditsDiffBox = ({ children, type }: EditsDiffBoxProps) => {
  const { translate } = useContext(GlobalContext);
  const bgColor = type === 'before' ? grey[50] : 'white';

  return (
    <Box
      style={{
        backgroundColor: bgColor,
        padding: theme.spacing(1),
      }}
    >
      <Typography gutterBottom>{translate(type)}</Typography>

      {children}
    </Box>
  );
};

export default EditsDiffBox;
