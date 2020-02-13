import { useContext } from 'react';
import { useRouter } from 'next/router';
import { Button, Container, Paper, Typography } from '@material-ui/core';
import { GlobalContext, theme } from '@zoonk/utils';

/**
 * Display a warning message when a chapter reached its lesson limit.
 */
const LessonLimit = () => {
  const { translate } = useContext(GlobalContext);
  const { back } = useRouter();

  return (
    <Container component="main" maxWidth="xs">
      <Paper style={{ marginTop: theme.spacing(8), padding: theme.spacing(3) }}>
        <Typography component="p" variant="body1">
          {translate('lessons_limit')}
        </Typography>
        <Button color="primary" onClick={back}>
          {translate('go_back')}
        </Button>
      </Paper>
    </Container>
  );
};

export default LessonLimit;
