import { useEffect, useState } from 'react';
import { Button, Grid, Paper, TextField, Typography } from '@material-ui/core';
import { updateProfile } from '@zoonk/services';
import { imgSize, theme } from '@zoonk/utils';
import ImageUpload from './ImageUpload';
import useAuth from './useAuth';
import useSnackbar from './useSnackbar';
import useTranslation from './useTranslation';

const ProfileUpdate = () => {
  const translate = useTranslation();
  const { user } = useAuth();
  const { action, snackbar } = useSnackbar();
  const [name, setName] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setBio(user.bio || '');
      setName(user.name);
      setPhoto(user.photo);
    }
  }, [user]);

  if (!user) return null;

  const handleSubmit = () => {
    snackbar('progress');
    updateProfile({ bio, name, photo }, user.uid)
      .then(() => snackbar('success'))
      .catch((e) => snackbar('error', e.message));
  };

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
            <ImageUpload
              img={photo}
              category="users"
              size={imgSize}
              onSave={setPhoto}
            />
          </Grid>
        </Grid>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          style={{ marginTop: theme.spacing(2) }}
          disabled={action === 'progress'}
        >
          {translate('save_changes')}
        </Button>
      </form>
    </Paper>
  );
};

export default ProfileUpdate;
