import { IconButton } from '@material-ui/core';
import { Facebook, GitHub, Instagram, Twitter } from '@material-ui/icons';
import { appLanguage } from '@zoonk/utils';

const links = {
  facebook: {
    en: 'https://facebook.com/zoonkapp',
    pt: 'https://facebook.com/ZoonkBrasil',
  },
  instagram: {
    en: 'https://instagram.com/zoonkapp',
    pt: 'https://instagram.com/zoonkbr',
  },
  twitter: {
    en: 'https://twitter.com/zoonkapp',
    pt: 'https://twitter.com/ZoonkBrasil',
  },
};

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
        href={links.facebook[appLanguage]}
      >
        <Facebook />
      </IconButton>

      <IconButton
        aria-label="Instagram"
        title="Instagram"
        component="a"
        href={links.instagram[appLanguage]}
      >
        <Instagram />
      </IconButton>

      <IconButton
        aria-label="Twitter"
        title="Twitter"
        component="a"
        href={links.twitter[appLanguage]}
      >
        <Twitter />
      </IconButton>

      <IconButton
        aria-label="GitHub"
        title="GitHub"
        component="a"
        href="https://github.com/zoonk"
      >
        <GitHub />
      </IconButton>
    </div>
  );
};

export default SocialLinks;
