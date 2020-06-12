import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Grid, TextField } from '@material-ui/core';
import Snackbar from '@zoonk/components/Snackbar';
import useAuth from '@zoonk/components/useAuth';
import { timestamp } from '@zoonk/firebase/db';
import { SnackbarAction } from '@zoonk/models';
import { addFeedback } from '@zoonk/services';
import { GlobalContext, theme } from '@zoonk/utils';

const ContactForm = () => {
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

      <Snackbar action={snackbar} />
    </form>
  );
};

export default ContactForm;
