import { Fragment, useEffect, useState } from 'react';
import Router from 'next/router';
import { Button, Drawer, Hidden, makeStyles } from '@material-ui/core';
import { Apps } from '@material-ui/icons';
import { Post } from '@zoonk/models';
import { getChapterLive } from '@zoonk/services';
import LessonsDrawer from './LessonsDrawer';
import NextLesson from './NextLesson';
import PreviousLesson from './PreviousLesson';
import useTranslation from './useTranslation';

interface PostBarLessonsProps {
  category: Post.Category;
  chapterId: string;
  postId: string;
  topicId: string;
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      marginRight: theme.spacing(1),
    },
  },
  button: {
    marginRight: theme.spacing(0),
    [theme.breakpoints.up('sm')]: {
      marginRight: theme.spacing(0.5),
    },
  },
  drawer: {
    padding: theme.spacing(2),
  },
}));

const PostBarLessons = ({
  category,
  chapterId,
  postId,
  topicId,
}: PostBarLessonsProps) => {
  const classes = useStyles();
  const [drawer, setDrawer] = useState<boolean>(false);
  const [lessons, setLessons] = useState<Post.Summary[]>([]);
  const translate = useTranslation();

  useEffect(() => {
    Router.events.on('routeChangeStart', () => setDrawer(false));
  }, []);

  useEffect(() => {
    const unsubscribe = getChapterLive(chapterId, (chapter) => {
      if (!chapter) return;
      const items =
        category === 'examples' ? chapter.exampleData : chapter.lessonData;
      setLessons(items);
    });

    return () => unsubscribe();
  }, [category, chapterId]);

  return (
    <Fragment>
      <div className={classes.root}>
        <Hidden smDown>
          <PreviousLesson
            chapterId={chapterId}
            postId={postId}
            topicId={topicId}
          />
          <NextLesson chapterId={chapterId} postId={postId} topicId={topicId} />
        </Hidden>

        <Button
          color="secondary"
          variant="outlined"
          onClick={() => setDrawer(true)}
        >
          <Apps className={classes.button} />
          <Hidden smDown>{translate('all')}</Hidden>
        </Button>
      </div>

      <Drawer open={drawer} onClose={() => setDrawer(false)} anchor="bottom">
        <LessonsDrawer lessons={lessons} onReturn={() => setDrawer(false)} />
      </Drawer>
    </Fragment>
  );
};

export default PostBarLessons;
