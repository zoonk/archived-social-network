import { Divider, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  divider: {
    width: '20px',
    height: '20px',
    margin: '40px auto',
    borderStyle: 'dotted',
    borderColor: theme.palette.primary.light,
    backgroundColor: 'white',
  },
}));

const CustomDivider = () => {
  const classes = useStyles();
  return <Divider className={classes.divider} />;
};

export default CustomDivider;
