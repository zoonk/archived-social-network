import { Fragment } from 'react';
import { makeStyles } from '@material-ui/core';

interface PostTitleProps {
  subtitle: string;
  title: string;
}

const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: '2rem',
    lineHeight: 1,
    marginBottom: '1.25rem',
    fontWeight: 700,
    [theme.breakpoints.up('md')]: {
      fontSize: '4rem',
    },
  },
  subtitle: {
    fontSize: '1.125rem',
    fontWeight: 400,
    fontStyle: 'italic',
    lineHeight: 1.25,
    textAlign: 'left',
  },
}));

const PostTitle = ({ subtitle, title }: PostTitleProps) => {
  const classes = useStyles();

  return (
    <Fragment>
      <h1 className={classes.title}>{title}</h1>
      <h2 className={classes.subtitle}>{subtitle}</h2>
    </Fragment>
  );
};

export default PostTitle;
