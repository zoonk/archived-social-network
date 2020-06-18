import { forwardRef } from 'react';
import { Link } from '@material-ui/core';
import { isInternal } from '@zoonk/utils';

const CustomLink = forwardRef<HTMLSpanElement>((props: any, ref) => {
  const { children, href } = props;

  return (
    <Link
      ref={ref}
      href={href}
      target={isInternal(href) ? '_self' : '_blank'}
      rel="noopener noreferrer"
    >
      {children}
    </Link>
  );
});

export default CustomLink;
