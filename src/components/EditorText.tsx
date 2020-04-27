import { Typography } from '@material-ui/core';
import { theme } from '@zoonk/utils';

interface EditorTextProps {
  children: React.ReactNode;
}

const EditorText = ({ children }: EditorTextProps) => {
  return (
    <Typography
      variant="body1"
      style={{
        margin: theme.spacing(1, 0),
        fontSize: '1.25rem',
        lineHeight: '2rem',
      }}
    >
      {children}
    </Typography>
  );
};

export default EditorText;
