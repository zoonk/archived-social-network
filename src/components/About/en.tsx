import { Fragment } from 'react';
import { Link, Typography } from '@material-ui/core';
import Divider from '../Divider';
import YoutubePlayer from '../YoutubePlayer';

const AboutEn = () => {
  return (
    <Fragment>
      <Typography gutterBottom>
        Zoonk is a <strong>free, open-source</strong> website for sharing
        learning resources. We want to make easier for everyone to learn
        something new and understand{' '}
        <strong>how to use their knowledge in everyday life</strong>.
      </Typography>

      <Divider />

      <Typography variant="h4" gutterBottom>
        Why is Zoonk important?
      </Typography>

      <Typography gutterBottom>
        Our <strong>educational system didn't change</strong> much since the
        Industrial Revolution. We're just memorizing information to pass exams.
        That's why{' '}
        <Link
          href="https://www.nais.org/media/MemberDocuments/Research/2017-HSSSE-Final.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          most people
        </Link>{' '}
        find <strong>schools boring</strong> and they don't understand how to
        apply school-based knowledge to everyday life.
      </Typography>

      <Typography gutterBottom>
        We're already seeing the consequences: a{' '}
        <strong>wave of fake news and science deniers</strong> because people
        aren't interested in learning anymore. In the next decades, we'll face
        another challenge: most people won't be prepared for the challenges
        presented by automation.
      </Typography>

      <Typography gutterBottom>
        We need to encourage people to acquire{' '}
        <strong>lifelong learning skills</strong> and make it easier for
        everyone to understand how complex topics (e.g. scientific concepts) are
        useful in their lives. Our goal is to{' '}
        <strong>bring good learning experiences to the common folk</strong> who
        wouldn't have an opportunity to get a high-quality education,{' '}
        <strong>preparing them for an ever-changing society</strong>.
      </Typography>

      <Typography gutterBottom>
        In the long-term,{' '}
        <strong>
          we should make learning as easy and fun as playing a video game
        </strong>{' '}
        or posting a selfie on social media.
      </Typography>

      <YoutubePlayer id="dqTTojTija8" />

      <Divider />

      <Typography variant="h4" gutterBottom>
        More information
      </Typography>

      <ul>
        <li>
          <Link
            href="https://github.com/zoonk/culture#goals"
            target="_blank"
            rel="noopener noreferrer"
          >
            Our goals
          </Link>
        </li>
        <li>
          <Link
            href="https://github.com/zoonk/culture#our-values"
            target="_blank"
            rel="noopener noreferrer"
          >
            Our values
          </Link>
        </li>
        <li>
          <Link
            href="https://github.com/zoonk/culture#challenges"
            target="_blank"
            rel="noopener noreferrer"
          >
            Challenges
          </Link>
        </li>
        <li>
          <Link
            href="https://github.com/zoonk/culture#how-can-i-help"
            target="_blank"
            rel="noopener noreferrer"
          >
            How can I help?
          </Link>
        </li>
        <li>
          <Link
            href="https://github.com/zoonk/culture#people"
            target="_blank"
            rel="noopener noreferrer"
          >
            Team
          </Link>
        </li>
      </ul>
    </Fragment>
  );
};

export default AboutEn;
