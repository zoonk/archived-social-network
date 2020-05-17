import { Button, makeStyles } from '@material-ui/core';
import { OpenInNew } from '@material-ui/icons';
import { Post } from '@zoonk/models';
import { getDomainFromUrl, isInternal } from '@zoonk/utils';

interface PostLinksProps {
  links: Post.Link[];
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: theme.spacing(-3),
    marginBottom: theme.spacing(1),
    '& > *': { marginRight: theme.spacing(1), marginBottom: theme.spacing(1) },
  },
  link: {},
}));

const PostLinks = ({ links }: PostLinksProps) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {links.slice(0, 3).map((link) => (
        <Button
          component="a"
          variant="outlined"
          color="secondary"
          href={link.url}
          target={isInternal(link.url) ? '_self' : '_blank'}
          rel={isInternal(link.url) ? undefined : 'noopener noreferrer'}
          className={classes.link}
          startIcon={<OpenInNew />}
          key={link.url}
        >
          {getDomainFromUrl(link.url)}
        </Button>
      ))}
    </div>
  );
};

export default PostLinks;
