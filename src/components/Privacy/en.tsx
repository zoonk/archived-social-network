import { Fragment } from 'react';
import NextLink from 'next/link';
import { Link, Typography } from '@material-ui/core';

const PrivacyEn = () => {
  return (
    <Fragment>
      <Typography component="h2" variant="h5" gutterBottom>
        What information Zoonk collects and why
      </Typography>

      <Typography component="p" variant="body1" gutterBottom>
        In order to improve your experience we log basic information about your
        visit:
      </Typography>

      <ul>
        <Typography component="li" variant="body1">
          Errors which happended while you were browsing something.
        </Typography>

        <Typography component="li" variant="body1">
          Actions you performed such as creating, updating, and deleting items.
        </Typography>

        <Typography component="li" variant="body1">
          Your browser type.
        </Typography>

        <Typography component="li" variant="body1">
          Referring site.
        </Typography>

        <Typography component="li" variant="body1">
          Your IP address.
        </Typography>
      </ul>

      <Typography component="p" variant="body1" gutterBottom>
        We use this information to test improvements to your experience but also
        to fight vandalism and any forms of spam.
      </Typography>

      <Typography component="p" variant="body1" gutterBottom>
        Please note that we <strong>do not sell your data</strong> to anyone.
      </Typography>

      <Typography component="h2" variant="h5" gutterBottom>
        Third-party services
      </Typography>

      <Typography component="p" variant="body1" gutterBottom>
        We rely on the following services to run Zoonk:
      </Typography>

      <Typography component="h3" variant="h6" gutterBottom>
        Analytics
      </Typography>

      <ul>
        <Typography component="li" variant="body1">
          <Link href="https://firebase.google.com/products/analytics">
            Google Analytics for Firebase
          </Link>
        </Typography>
      </ul>

      <Typography component="h3" variant="h6" gutterBottom>
        Authentication
      </Typography>

      <ul>
        <Typography component="li" variant="body1">
          <Link href="https://firebase.google.com/products/auth/">
            Firebase Authentication
          </Link>
        </Typography>
      </ul>

      <Typography component="h3" variant="h6" gutterBottom>
        Hosting
      </Typography>

      <ul>
        <Typography component="li" variant="body1">
          <Link href="https://vercel.com">Vercel</Link>
        </Typography>
      </ul>

      <Typography component="h3" variant="h6" gutterBottom>
        Storage
      </Typography>

      <ul>
        <Typography component="li" variant="body1">
          <Link href="https://firebase.google.com/products/firestore/">
            Google Cloud Firestore
          </Link>
        </Typography>

        <Typography component="li" variant="body1">
          <Link href="https://firebase.google.com/products/storage/">
            Google Cloud Storage
          </Link>
        </Typography>
      </ul>

      <Typography component="h2" variant="h5" gutterBottom>
        Cookies
      </Typography>

      <Typography component="p" variant="body1" gutterBottom>
        We do not use cookies directly. However, our third-party services like
        Google Analytics, do use cookies to track your visits. Those cookies do
        not provide us any personal information.
      </Typography>

      <Typography component="h2" variant="h5" gutterBottom>
        Deleting your data
      </Typography>

      <Typography component="p" variant="body1" gutterBottom>
        You may request deletion of your personal information by emailing
        support@zoonk.org. You can also request a copy of your data at anytime.
        It might take up to 30 (thirty) days to process your request.
      </Typography>

      <Typography component="h2" variant="h5" gutterBottom>
        Commitment
      </Typography>

      <Typography component="p" variant="body1" gutterBottom>
        We are commited to improve our privacy policy and, in the long-term,
        rely less in third-party services which might track your data. If you
        have any suggestions about how we can improve our privacy policy, please{' '}
        <NextLink href="/contact" passHref>
          <Link>contact us</Link>
        </NextLink>
        .
      </Typography>
    </Fragment>
  );
};

export default PrivacyEn;
