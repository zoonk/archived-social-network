import { useEffect, useState } from 'react';
import {
  Button,
  Grid,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core';
import {
  Facebook,
  GitHub,
  Instagram,
  LinkedIn,
  Twitter,
  Web,
  YouTube,
} from '@material-ui/icons';
import { updateProfile } from '@zoonk/services';
import { theme } from '@zoonk/utils';
import useSnackbar from './useSnackbar';
import useAuth from './useAuth';
import useTranslation from './useTranslation';

const SocialMediaUpdate = () => {
  const translate = useTranslation();
  const { user } = useAuth();
  const { action, snackbar } = useSnackbar();
  const [linkedin, setLinkedin] = useState<string>('');
  const [twitter, setTwitter] = useState<string>('');
  const [facebook, setFacebook] = useState<string>('');
  const [instagram, setInstagram] = useState<string>('');
  const [github, setGithub] = useState<string>('');
  const [youtube, setYoutube] = useState<string>('');
  const [web, setWeb] = useState<string>('');

  useEffect(() => {
    if (user) {
      setLinkedin(user.linkedin || '');
      setTwitter(user.twitter || '');
      setFacebook(user.facebook || '');
      setInstagram(user.instagram || '');
      setGithub(user.github || '');
      setYoutube(user.youtube || '');
      setWeb(user.web || '');
    }
  }, [user]);

  if (!user) return null;

  const handleSubmit = () => {
    snackbar('progress');
    updateProfile(
      { linkedin, twitter, facebook, instagram, github, youtube, web },
      user.uid,
    )
      .then(() => snackbar('success'))
      .catch((e) => snackbar('error', e.message));
  };

  return (
    <Paper variant="outlined" style={{ padding: theme.spacing(3) }}>
      <Typography component="h3" variant="h5">
        {translate('social_media')}
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
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              variant="outlined"
              fullWidth
              id="update-linkedin"
              placeholder="https://linkedin.com/in/reidhoffman"
              label="LinkedIn"
              name="linkedin"
              autoComplete="url"
              type="url"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LinkedIn />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
              variant="outlined"
              fullWidth
              id="update-twitter"
              label="Twitter"
              placeholder="https://twitter.com/jack"
              name="Twitter"
              autoComplete="url"
              type="url"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Twitter />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              variant="outlined"
              fullWidth
              id="update-facebook"
              label="Facebook"
              placeholder="https://facebook.com/zuck"
              name="Facebook"
              autoComplete="url"
              type="url"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Facebook />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              variant="outlined"
              fullWidth
              id="update-instagram"
              label="Instagram"
              placeholder="https://instagram.com/mikeyk"
              name="Instagram"
              autoComplete="url"
              type="url"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Instagram />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              variant="outlined"
              fullWidth
              id="update-github"
              label="GitHub"
              placeholder="https://github.com/defunkt"
              name="GitHub"
              autoComplete="url"
              type="url"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <GitHub />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              value={youtube}
              onChange={(e) => setYoutube(e.target.value)}
              variant="outlined"
              fullWidth
              id="update-youtube"
              label="YouTube"
              placeholder="https://youtube.com/jawed"
              name="YouTube"
              autoComplete="url"
              type="url"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <YouTube />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              value={web}
              onChange={(e) => setWeb(e.target.value)}
              variant="outlined"
              fullWidth
              id="update-web"
              label={translate('website')}
              placeholder="https://zoonk.org/profile/will"
              name="web"
              autoComplete="url"
              type="url"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Web />
                  </InputAdornment>
                ),
              }}
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

export default SocialMediaUpdate;
