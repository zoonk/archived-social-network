import { useContext, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import {
  Avatar,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core';
import { Mail } from '@material-ui/icons';
import Meta from '@zoonk/components/Meta';
import Snackbar from '@zoonk/components/Snackbar';
import useAuth from '@zoonk/components/useAuth';
import { timestamp } from '@zoonk/firebase/db';
import { SnackbarAction } from '@zoonk/models';
import { addFeedback } from '@zoonk/services';
import { GlobalContext, rootUrl, theme } from '@zoonk/utils';

const Contact: NextPage = () => {
  const { translate } = useContext(GlobalContext);
  const { user } = useAuth();
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);
  const { query } = useRouter();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const handleSubmit = () => {
    setSnackbar({ type: 'progress', msg: translate('sending') });

    addFeedback({
      createdAt: timestamp,
      name,
      email,
      message,
      query: JSON.stringify(query),
      uid: user ? user.uid : null,
    })
      .then(() => setSnackbar({ type: 'success', msg: translate('sent') }))
      .catch((err) => {
        setSnackbar({
          type: 'error',
          msg: err.message,
          log: {
            code: err.code,
            description: 'contact_form',
          },
        });
      });
  };

  useEffect(() => {
    if (user && user.email) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  return (
    <Container
      component="main"
      maxWidth="xs"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: theme.spacing(8),
      }}
    >
      <Meta
        title={translate('contact_us')}
        description={translate('seo_contact_desc')}
        canonicalUrl={`${rootUrl}/contact`}
      />

      <Avatar style={{ backgroundColor: theme.palette.primary.main }}>
        <Mail />
      </Avatar>

      <Typography component="h2" variant="h5">
        {translate('contact_us')}
      </Typography>

      <form
        style={{
          width: '100%',
          marginTop: theme.spacing(3),
        }}
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <Grid container spacing={2}>
          {!user && (
            <Grid item xs={12}>
              <TextField
                value={name}
                onChange={(e) => setName(e.target.value)}
                variant="outlined"
                required
                fullWidth
                id="contact-name"
                label={translate('name')}
                name="name"
                autoComplete="full-name"
                type="text"
              />
            </Grid>
          )}

          {!user && (
            <Grid item xs={12}>
              <TextField
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
                required
                fullWidth
                id="email"
                label={translate('email')}
                name="email"
                autoComplete="email"
                type="email"
              />
            </Grid>
          )}

          <Grid item xs={12}>
            <TextField
              multiline
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              variant="outlined"
              required
              fullWidth
              id="send-message"
              label={translate('message')}
              name="message"
            />
          </Grid>
        </Grid>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          style={{ margin: theme.spacing(3, 0, 2) }}
        >
          {translate('send')}
        </Button>
      </form>

      <Snackbar action={snackbar} />
    </Container>
  );
};

export default Contact;
