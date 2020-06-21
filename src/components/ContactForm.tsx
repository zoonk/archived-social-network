import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Grid, TextField } from '@material-ui/core';
import { timestamp } from '@zoonk/firebase/db';
import { addFeedback } from '@zoonk/services';
import { theme } from '@zoonk/utils';
import useAuth from './useAuth';
import useSnackbar from './useSnackbar';
import useTranslation from './useTranslation';

const ContactForm = () => {
  const translate = useTranslation();
  const { user } = useAuth();
  const { snackbar } = useSnackbar();
  const { query } = useRouter();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const handleSubmit = () => {
    snackbar('progress', translate('sending'));

    addFeedback({
      createdAt: timestamp,
      name,
      email,
      message,
      query: JSON.stringify(query),
      uid: user ? user.uid : null,
    })
      .then(() => {
        setMessage('');
        snackbar('success', translate('sent'));
      })
      .catch((e) => snackbar('error', e.message));
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
    </form>
  );
};

export default ContactForm;
