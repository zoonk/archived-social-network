import { Button, makeStyles, Paper, Typography } from '@material-ui/core';
import useTranslation from './useTranslation';

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
  const translate = useTranslation();
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
