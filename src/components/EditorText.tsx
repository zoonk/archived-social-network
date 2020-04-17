import { Typography } from '@material-ui/core';
import { postFont, theme } from '@zoonk/utils';

interface EditorTextProps {
  children: React.ReactNode;
}

const EditorText = ({ children }: EditorTextProps) => {
  return (
    <Typography
      variant="body1"
      style={{
        marginTop: theme.spacing(2),
        fontSize: '21px',
        fontFamily: postFont,
        letterSpacing: '-0.004em',
        lineHeight: '1.58',
        wordBreak: 'break-word',
      }}
    >
      {children}
    </Typography>
  );
};

export default EditorText;
