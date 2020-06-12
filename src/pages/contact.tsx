import { useContext } from 'react';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { Avatar, Container, Typography } from '@material-ui/core';
import { Mail } from '@material-ui/icons';
import Meta from '@zoonk/components/Meta';
import { GlobalContext, rootUrl, theme } from '@zoonk/utils';

const ContactForm = dynamic(() => import('@zoonk/components/ContactForm'), {
  ssr: false,
});

const Contact: NextPage = () => {
  const { translate } = useContext(GlobalContext);

  return (
    <Container
      component="main"
      maxWidth="xs"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: theme.spacing(8),
      }}
    >
      <Meta
        title={translate('contact_us')}
        description={translate('seo_contact_desc')}
        canonicalUrl={`${rootUrl}/contact`}
      />

      <Avatar style={{ backgroundColor: theme.palette.primary.main }}>
        <Mail />
      </Avatar>

      <Typography component="h2" variant="h5">
        {translate('contact_us')}
      </Typography>

      <ContactForm />
    </Container>
  );
};

export default Contact;
