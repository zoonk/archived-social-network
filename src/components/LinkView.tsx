import { Link } from '@material-ui/core';

interface LinkViewProps {
  children: React.ReactNode;
  href: string;
}

/**
 * Custom link renderer for markdown viewer.
 */
const LinkView = ({ children, href }: LinkViewProps) => {
  const isInternal = href.includes('zoonk.org') || href.startsWith('/');

  return (
    <Link
      href={href}
      target={isInternal ? '_self' : '_blank'}
      rel="noopener noreferrer"
    >
      {children}
    </Link>
  );
};

export default LinkView;
