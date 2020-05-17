import { IconButton } from '@material-ui/core';
import {
  LinkedIn,
  Instagram,
  Facebook,
  Twitter,
  YouTube,
  GitHub,
  Web,
} from '@material-ui/icons';
import { Profile } from '@zoonk/models';

interface ProfileSocialProps {
  data: Profile.Response;
}

const ProfileSocial = ({ data }: ProfileSocialProps) => {
  const { facebook, github, instagram, linkedin, twitter, web, youtube } = data;
  const social = [
    { name: 'web', icon: <Web />, url: web },
    { name: 'github', icon: <GitHub />, url: github },
    { name: 'linkedin', icon: <LinkedIn />, url: linkedin },
    { name: 'twitter', icon: <Twitter />, url: twitter },
    { name: 'instagram', icon: <Instagram />, url: instagram },
    { name: 'facebook', icon: <Facebook />, url: facebook },
    { name: 'youtube', icon: <YouTube />, url: youtube },
  ];
  const links = social.filter((link) => link.url);

  return (
    <div>
      {links.map((link) => (
        <IconButton
          component="a"
          key={link.name}
          href={link.url || undefined}
          size="small"
          edge="start"
          aria-label={link.name}
          title={link.name}
          target="_blank"
          rel="noopener noreferrer"
        >
          {link.icon}
        </IconButton>
      ))}
    </div>
  );
};

export default ProfileSocial;
