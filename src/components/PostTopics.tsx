import { useContext } from 'react';
import NextLink from 'next/link';
import { Link, makeStyles } from '@material-ui/core';
import { GlobalContext, getPageTitle } from '@zoonk/utils';

interface PostTopicsProps {
  topics: string[];
}

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(1),
    marginBottom: '2.5rem',
    '& > *': {
      marginRight: theme.spacing(1),
    },
  },
}));

const PostTopics = ({ topics }: PostTopicsProps) => {
  const { translate } = useContext(GlobalContext);
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {topics.slice(0, 3).map((topic) => {
        const title = getPageTitle(topic);

        return (
          <NextLink
            href="/topics/[id]"
            as={`/topics/${topic}`}
            key={topic}
            passHref
          >
            <Link title={translate('learn_about', { title })}># {title}</Link>
          </NextLink>
        );
      })}
    </div>
  );
};

export default PostTopics;
