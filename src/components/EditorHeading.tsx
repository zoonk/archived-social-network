import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { IconButton, makeStyles, Typography } from '@material-ui/core';
import { Link } from '@material-ui/icons';
import { GlobalContext, rootUrl } from '@zoonk/utils';

interface EditorHeadingProps {
  children: React.ReactNode;
}

const useStyles = makeStyles((theme) => ({
  h2: {
    color: theme.palette.primary.main,
    fontSize: '1.875rem',
    fontWeight: 700,
    wordBreak: 'break-word',
    textDecoration: 'underline',
    margin: theme.spacing(5, 0, 2, 0),
  },
}));

const EditorHeading = ({ children }: EditorHeadingProps) => {
  const { translate } = useContext(GlobalContext);
  const classes = useStyles();
  const [copied, setCopied] = useState<boolean>(false);
  const id = (children as any)?.['0'].props?.value;
  const { asPath } = useRouter();
  const link = `${rootUrl}${asPath}#${id}`;

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (copied) {
      timer = setTimeout(() => setCopied(false), 2000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [copied]);

  const copy = () => {
    navigator.clipboard.writeText(link).then(() => setCopied(true));
  };

  return (
    <h2 className={classes.h2}>
      {children}
      <IconButton onClick={copy} id={id}>
        <Link />
      </IconButton>
      {copied && (
        <Typography color="primary" variant="caption">
          {translate('link_copied')}
        </Typography>
      )}
    </h2>
  );
};

export default EditorHeading;
