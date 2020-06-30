import { Fragment } from 'react';
import { Button, Grid, makeStyles } from '@material-ui/core';
import { ChapterProgress, Post } from '@zoonk/models';
import { getLessonStatus } from '@zoonk/utils';
import LessonListItem from './LessonListItem';
import useTranslation from './useTranslation';

interface LessonDrawerProps {
  category: keyof ChapterProgress.Response;
  lessons: Post.Summary[];
  progress?: ChapterProgress.Response;
  onReturn: () => void;
}

const useStyles = makeStyles((theme) => ({
  back: { margin: theme.spacing(2) },
  grid: {
    padding: theme.spacing(2),
  },
}));

const LessonsDrawer = ({
  category,
  lessons,
  progress,
  onReturn,
}: LessonDrawerProps) => {
  const translate = useTranslation();
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
            <LessonListItem
              item={lesson}
              index={index}
              status={getLessonStatus(category, lesson.id, progress)}
            />
          </Grid>
        ))}
      </Grid>
    </Fragment>
  );
};

export default LessonsDrawer;
