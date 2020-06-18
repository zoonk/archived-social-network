import { forwardRef, Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useReadOnly } from 'slate-react';
import { IconButton, makeStyles, Typography } from '@material-ui/core';
import { Link } from '@material-ui/icons';
import { rootUrl } from '@zoonk/utils';
import useTranslation from '../useTranslation';

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

interface HeadingProps {
  title: string;
}

const Heading = forwardRef<HTMLHeadingElement, HeadingProps>((props, ref) => {
  const { children, title } = props;
  const isReadOnly = useReadOnly();
  const translate = useTranslation();
  const classes = useStyles();
  const [copied, setCopied] = useState<boolean>(false);
  const id = title;
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
    <h2 ref={ref} className={classes.h2}>
      {children}
      {isReadOnly && (
        <Fragment>
          <IconButton onClick={copy} id={id}>
            <Link />
          </IconButton>
          {copied && (
            <Typography color="primary" variant="caption">
              {translate('link_copied')}
            </Typography>
          )}
        </Fragment>
      )}
    </h2>
  );
});

export default Heading;
