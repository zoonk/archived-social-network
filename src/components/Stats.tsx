import { useEffect, useState } from 'react';
import { CircularProgress, Grid, Paper, Typography } from '@material-ui/core';
import { Admin } from '@zoonk/models';
import { getStats } from '@zoonk/services';
import { theme } from '@zoonk/utils';
import {
  AllInclusive,
  Book,
  Comment,
  Description,
  GroupWork,
  Language,
  Link,
  MenuBook,
  QuestionAnswer,
  School,
  Subject,
  SupervisorAccount,
} from '@material-ui/icons';
import useTranslation from './useTranslation';

interface Item {
  key: keyof Admin.Stats;
  icon: React.ReactNode;
}

const items: Item[] = [
  { key: 'users', icon: <SupervisorAccount /> },
  { key: 'timeline', icon: <AllInclusive /> },
  { key: 'topics', icon: <Subject /> },
  { key: 'groups', icon: <GroupWork /> },
  { key: 'chapters', icon: <Book /> },
  { key: 'lessons', icon: <Book /> },
  { key: 'references', icon: <Link /> },
  { key: 'courses', icon: <School /> },
  { key: 'books', icon: <MenuBook /> },
  { key: 'posts', icon: <Description /> },
  { key: 'examples', icon: <Language /> },
  { key: 'questions', icon: <QuestionAnswer /> },
  { key: 'comments', icon: <Comment /> },
];

const Stats = () => {
  const translate = useTranslation();
  const [stats, setStats] = useState<Admin.Stats | null>(null);

  useEffect(() => {
    getStats().then(setStats);
  }, []);

  if (!stats) {
    return <CircularProgress />;
  }

  return (
    <Grid container spacing={2}>
      {items.map((item) => (
        <Grid item xs={6} sm={4} key={item.key}>
          <Paper
            variant="outlined"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: theme.spacing(2),
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {item.icon}
              <Typography style={{ marginLeft: theme.spacing(1) }}>
                {translate(item.key)}
              </Typography>
            </div>
            <Typography variant="h5" color="primary">
              {stats[item.key]}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default Stats;
