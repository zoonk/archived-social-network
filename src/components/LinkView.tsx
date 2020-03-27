import { Link } from '@material-ui/core';
import { isInternal } from '@zoonk/utils';

interface LinkViewProps {
  children: React.ReactNode;
  href: string;
}

/**
 * Custom link renderer for markdown viewer.
 */
const LinkView = ({ children, href }: LinkViewProps) => {
  return (
    <Link
      href={href}
      target={isInternal(href) ? '_self' : '_blank'}
      rel="noopener noreferrer"
    >
      {children}
    </Link>
  );
};

export default LinkView;
