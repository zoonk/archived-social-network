import { Fragment, useContext } from 'react';
import { Button, Grid, makeStyles } from '@material-ui/core';
import { Post } from '@zoonk/models';
import { GlobalContext } from '@zoonk/utils';
import LessonListItem from './LessonListItem';

interface LessonDrawerProps {
  lessons: Post.Summary[];
  onReturn: () => void;
}

const useStyles = makeStyles((theme) => ({
  back: { margin: theme.spacing(2) },
  grid: {
    padding: theme.spacing(2),
  },
}));

const LessonsDrawer = ({ lessons, onReturn }: LessonDrawerProps) => {
  const { translate } = useContext(GlobalContext);
  const classes = useStyles();

  return (
    <Fragment>
      <div>
        <Button
          variant="outlined"
          color="primary"
          onClick={onReturn}
          className={classes.back}
        >
          {translate('go_back')}
        </Button>
      </div>
      <Grid container spacing={2} className={classes.grid}>
        {lessons.map((lesson, index) => (
          <Grid item key={lesson.id} xs={12} sm={6}>
            <LessonListItem item={lesson} index={index} />
          </Grid>
        ))}
      </Grid>
    </Fragment>
  );
};

export default LessonsDrawer;
