import { IconButton } from '@material-ui/core';
import { Facebook, GitHub, Instagram, Twitter } from '@material-ui/icons';

/**
 * Display a link for our social media profiles.
 */
const SocialLinks = () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <IconButton
        aria-label="Facebook"
        title="Facebook"
        component="a"
        href="https://www.facebook.com/zoonkofficial"
      >
        <Facebook />
      </IconButton>

      <IconButton
        aria-label="Instagram"
        title="Instagram"
        component="a"
        href="https://www.facebook.com/zoonkofficial"
      >
        <Instagram />
      </IconButton>

      <IconButton
        aria-label="Twitter"
        title="Twitter"
        component="a"
        href="https://twitter.com/zoonkofficial"
      >
        <Twitter />
      </IconButton>

      <IconButton
        aria-label="GitLab"
        title="GitLab"
        component="a"
        href="https://github.com/zoonk"
      >
        <GitHub />
      </IconButton>
    </div>
  );
};

export default SocialLinks;
