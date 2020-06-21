import * as functions from 'firebase-functions';
import { Report } from '@zoonk/models';
import { mailClient } from '../../mail';
import { supportEmail } from '../../settings';

export const onCreateReportSendEmail = functions.firestore
  .document('reports/{id}')
  .onCreate((snap) => {
    const data = snap.data() as Report.Response;
    const userEmail = data.user?.email;
    const msg = {
      to: supportEmail,
      from: supportEmail,
      reply_to: userEmail || supportEmail,
      subject: 'Content report',
      html: `
        <strong>Name:</strong> ${data.user?.name || 'none'} <br />
        <strong>Email:</strong> ${userEmail || 'none'} <br />
        <strong>UID:</strong> ${data.uid || 'none'} <br />
        <strong>Edit:</strong> <a href="https://en.zoonk.org/edits/${
          data.editId
        }">${data.editId}</a> <br />
        <strong>Message:</strong> ${data.comments}
      `,
    };
    return mailClient.send(msg);
  });
