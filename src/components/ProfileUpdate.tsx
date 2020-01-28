import { useContext, useEffect, useState } from 'react';
import { Button, Grid, Paper, TextField, Typography } from '@material-ui/core';
import { SnackbarAction } from '@zoonk/models';
import { updateProfile } from '@zoonk/services';
import { firebaseError, GlobalContext, theme } from '@zoonk/utils';
import Snackbar from './Snackbar';
import ImageUpload from './ImageUpload';

const ProfileUpdate = () => {
  const { translate, user } = useContext(GlobalContext);
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);
  const [name, setName] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [photo, setPhoto] = useState<string | null>(null);

  const handleSubmit = () => {
    setSnackbar({ type: 'progress', msg: translate('saving') });

    if (user) {
      updateProfile({ bio, name, photo }, user.uid)
        .then(() => setSnackbar({ type: 'success', msg: translate('saved') }))
        .catch((e) => setSnackbar(firebaseError(e, 'profile_update')));
    }
  };

  useEffect(() => {
    if (user) {
      setBio(user.bio || '');
      setName(user.name);
      setPhoto(user.photo);
    }
  }, [user]);

  return (
    <Paper variant="outlined" style={{ padding: theme.spacing(3) }}>
      <Typography component="h3" variant="h5">
        {translate('edit_profile')}
      </Typography>

      <form
        style={{ marginTop: theme.spacing(3) }}
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant="outlined"
              required
              fullWidth
              id="update-name"
              label={translate('name')}
              name="name"
              autoComplete="full-name"
              type="text"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              multiline
              rows={4}
              variant="outlined"
              fullWidth
              id="update-bio"
              label={translate('about_me')}
              name="bio"
            />
          </Grid>

          <Grid item xs={12}>
            <ImageUpload img={photo} category="users" onSave={setPhoto} />
          </Grid>
        </Grid>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          style={{ marginTop: theme.spacing(2) }}
        >
          {translate('save_changes')}
        </Button>
      </form>

      <Snackbar action={snackbar} />
    </Paper>
  );
};

export default ProfileUpdate;
