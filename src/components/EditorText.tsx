import { Typography } from '@material-ui/core';

interface EditorTextProps {
  children: React.ReactNode;
}

const EditorText = ({ children }: EditorTextProps) => {
  return (
    <Typography gutterBottom variant="body1">
      {children}
    </Typography>
  );
};

export default EditorText;
