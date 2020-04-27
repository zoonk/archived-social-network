import { makeStyles, Typography } from '@material-ui/core';
import { postFont } from '@zoonk/utils';

interface PostTitleProps {
  children: React.ReactNode;
}

const useStyles = makeStyles((theme) => ({
  title: {
    fontFamily: postFont,
    fontSize: theme.typography.h4.fontSize,
    lineHeight: 1.1,
    [theme.breakpoints.up('md')]: {
      fontSize: theme.typography.h3.fontSize,
    },
  },
}));

const PostTitle = ({ children }: PostTitleProps) => {
  const classes = useStyles();

  return (
    <Typography component="h1" className={classes.title}>
      {children}
    </Typography>
  );
};

export default PostTitle;
