import { Fragment } from 'react';
import NextLink from 'next/link';
import { Link, Typography } from '@material-ui/core';

const TermsEn = () => {
  return (
    <Fragment>
      <Typography component="p" variant="body1" gutterBottom>
        By using any services provided by Zoonk, you agree to the following
        terms:
      </Typography>

      <ul>
        <Typography component="li" variant="body1">
          You accept our{' '}
          <NextLink href="/privacy" passHref>
            <Link>privacy policy</Link>
          </NextLink>
        </Typography>

        <Typography component="li" variant="body1">
          You are 13 (thirteen) years-old or older.
        </Typography>

        <Typography component="li" variant="body1">
          You are responsible for any content you published in the platform.
        </Typography>

        <Typography component="li" variant="body1">
          Your published content does not break any laws.
        </Typography>
      </ul>

      <Typography component="h2" variant="h5" gutterBottom>
        Code of conduct
      </Typography>

      <Typography component="p" variant="body1" gutterBottom>
        By using Zoonk, you accept to follow the{' '}
        <Link href="https://www.contributor-covenant.org/version/2/0/code_of_conduct">
          Contributor Covenant Code of Conduct
        </Link>
        .
      </Typography>

      <Typography component="p" variant="body1" gutterBottom>
        We aim to create an inclusive community for everyone, regardless of age,
        body size, visible or invisible disability, ethnicity, sex
        characteristics, gender identity and expression, level of experience,
        education, socio-economic status, nationality, personal appearance,
        race, religion, or sexual identity and orientation.
      </Typography>

      <Typography component="p" variant="body1" gutterBottom>
        Therefore, we will not accept any forms of bullying, harassment or
        discrimination. This includes, but it is not limited to:
      </Typography>

      <ul>
        <Typography component="li" variant="body1">
          Discriminory language or behavior towards any individuals or groups of
          people.
        </Typography>

        <Typography component="li" variant="body1">
          Disrespectful language or behavior towards any individuals or groups
          of people.
        </Typography>
      </ul>

      <Typography component="p" variant="body1" gutterBottom>
        We will not accept any content propagating false information. This
        includes, but it is not limited to:
      </Typography>

      <ul>
        <Typography component="li" variant="body1">
          Information which could not be verified by the scientific community or
          by multiple media outlets.
        </Typography>

        <Typography component="li" variant="body1">
          Conspiracy theories or sensationalism.
        </Typography>

        <Typography component="li" variant="body1">
          Content published to manipulate information, individuals or groups of
          people.
        </Typography>

        <Typography component="li" variant="body1">
          Political propaganda.
        </Typography>

        <Typography component="li" variant="body1">
          Pyramid schemes or similar practices.
        </Typography>
      </ul>

      <Typography component="h2" variant="h5" gutterBottom>
        Suspension
      </Typography>

      <Typography component="p" variant="body1" gutterBottom>
        Your account might be suspended or banned if you break any of terms
        written here. If your account is suspended, you can appeal from our
        decision emailing support@zoonk.org.
      </Typography>

      <Typography component="h2" variant="h5" gutterBottom>
        Infringement
      </Typography>

      <Typography component="p" variant="body1" gutterBottom>
        If you find anyone or any content not complying to these rules, please{' '}
        <NextLink href="/contact" passHref>
          <Link>contact us</Link>
        </NextLink>
        .
      </Typography>
    </Fragment>
  );
};

export default TermsEn;
