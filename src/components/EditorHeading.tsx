import { Typography } from '@material-ui/core';
import { postFont, theme } from '@zoonk/utils';

interface EditorHeadingProps {
  children: React.ReactNode;
}

const EditorHeading = ({ children }: EditorHeadingProps) => {
  return (
    <Typography
      component="h2"
      variant="h5"
      style={{
        marginTop: theme.spacing(2),
        fontSize: '34px',
        fontWeight: 700,
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

export default EditorHeading;
