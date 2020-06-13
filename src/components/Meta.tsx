import Head from 'next/head';
import { rootUrl, socialIcon } from '@zoonk/utils';
import useTranslation from './useTranslation';

interface MetaProps {
  canonicalUrl?: string;
  children?: React.ReactNode;
  description?: string;
  image?: string | null;
  noIndex?: boolean;
  noAppName?: boolean;
  title: string;
}

const Meta = ({
  canonicalUrl,
  children,
  description,
  image,
  noAppName,
  noIndex,
  title,
}: MetaProps) => {
  const translate = useTranslation();
  const pageDescription = description || translate('social_description');
  const pageImage = image || socialIcon;
  const displayTitle = noAppName ? title : `${title} | Zoonk`;

  return (
    <Head>
      <title>{displayTitle}</title>
      {description && <meta name="description" content={description} />}
      <meta property="og:title" content={displayTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:site_name" content="Zoonk" />
      <meta property="og:type" content="website" />
      <meta property="twitter:title" content={displayTitle} />
      <meta property="twitter:description" content={pageDescription} />
      <meta property="twitter:image" content={pageImage} />
      <meta property="twitter:site" content="@zoonkofficial" />
      <meta name="robots" content={noIndex ? 'noindex' : 'index, follow'} />
      <link rel="canonical" href={canonicalUrl || rootUrl} />

      {children}
    </Head>
  );
};

export default Meta;
