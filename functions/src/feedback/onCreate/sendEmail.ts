import * as functions from 'firebase-functions';
import { Feedback } from '@zoonk/models';
import { mailClient } from '../../mail';
import { supportEmail } from '../../settings';

export const onCreateFeedbackSendEmail = functions.firestore
  .document('feedback/{id}')
  .onCreate((snap) => {
    const data = snap.data() as Feedback.Response;
    const msg = {
      to: supportEmail,
      from: supportEmail,
      reply_to: data.email || supportEmail,
      subject: 'Zoonk feedback',
      html: `
        <strong>Name:</strong> ${data.name} <br />
        <strong>Email:</strong> ${data.email || 'none'} <br />
        <strong>UID:</strong> ${data.uid} <br />
        <strong>Query:</strong> ${data.query} <br />
        <strong>Message:</strong> ${data.message}
      `,
    };
    return mailClient.send(msg);
  });
