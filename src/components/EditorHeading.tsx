import { Typography } from '@material-ui/core';

interface EditorHeadingProps {
  children: React.ReactNode;
}

const EditorHeading = ({ children }: EditorHeadingProps) => {
  return (
    <Typography component="h2" gutterBottom variant="h5">
      {children}
    </Typography>
  );
};

export default EditorHeading;
