import { useContext } from 'react';
import { Button, makeStyles, Paper, Typography } from '@material-ui/core';
import { GlobalContext } from '@zoonk/utils';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}));

interface ShowCardProps {
  title: string;
  onShow: () => void;
}

const ShowCard = ({ title, onShow }: ShowCardProps) => {
  const { translate } = useContext(GlobalContext);
  const classes = useStyles();

  return (
    <Paper variant="outlined" className={classes.paper}>
      <Typography variant="h5">{title}</Typography>
      <Button variant="outlined" color="primary" onClick={onShow}>
        {translate('show')}
      </Button>
    </Paper>
  );
};

export default ShowCard;
