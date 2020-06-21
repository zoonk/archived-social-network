import { Fragment } from 'react';
import NextLink from 'next/link';
import { Link, makeStyles } from '@material-ui/core';
import { Profile } from '@zoonk/models';
import useTranslation from './useTranslation';

interface PostCreditsProps {
  author: Profile.Get;
  createdAt: string;
  editors: Profile.Get[];
  updatedAt: string;
}

const useStyles = makeStyles(() => ({
  author: {
    fontWeight: 100,
  },
}));

const PostCredits = ({
  author,
  createdAt,
  editors,
  updatedAt,
}: PostCreditsProps) => {
  const translate = useTranslation();
  const classes = useStyles();
  const editedBy = editors.filter((editor) => editor.id !== author.id);

  return (
    <Fragment>
      <h5 className={classes.author}>
        {translate('created_by')}{' '}
        <NextLink
          href="/profile/[id]"
          as={`/profile/${author.username}`}
          passHref
        >
          <Link color="textPrimary" variant="inherit">
            <strong>{author.name}</strong>
          </Link>
        </NextLink>
      </h5>

      {editedBy.length > 0 && (
        <h5 className={classes.author}>
          {translate('editors')}:{' '}
          {editedBy.map((editor, index) => (
            <Fragment key={editor.id}>
              <NextLink
                href="/profile/[id]"
                as={`/profile/${editor.username}`}
                passHref
              >
                <Link color="textPrimary" variant="inherit">
                  <strong>{editor.name}</strong>
                </Link>
              </NextLink>
              {index !== editedBy.length - 1 && <span>, </span>}
            </Fragment>
          ))}
        </h5>
      )}

      <h5 className={classes.author}>
        {translate('created_on', { date: createdAt })} -{' '}
        <strong>{translate('updated_on', { date: updatedAt })}</strong>
      </h5>
    </Fragment>
  );
};

export default PostCredits;
