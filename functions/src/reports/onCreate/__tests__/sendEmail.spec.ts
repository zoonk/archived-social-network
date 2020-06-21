import functions from 'firebase-functions-test';

const testEnv = functions();
testEnv.mockConfig({ sendgrid: { api_key: 'SG.random-key' } });

import { mailClient } from '../../../mail';
import { supportEmail } from '../../../settings';
import { onCreateReportSendEmail } from '../sendEmail';

beforeAll(() => {
  spyOn(mailClient, 'send').and.returnValue('sent');
});

test('send an email when a feedback is received', async (done) => {
  const data = {
    comments: 'message',
    editId: 'itemId',
    uid: 'user id',
    user: { email: 'test@test.com', name: 'test name' },
  };
  const snap = { data: () => data };

  const wrapped = testEnv.wrap(onCreateReportSendEmail);
  const req = await wrapped(snap);

  const html = `
  <strong>Name:</strong> test name <br />
  <strong>Email:</strong> test@test.com <br />
  <strong>UID:</strong> user id <br />
  <strong>Edit:</strong> <a href="https://en.zoonk.org/edits/itemId">itemId</a> <br />
  <strong>Message:</strong> message
`;
  const payload = {
    to: supportEmail,
    from: supportEmail,
    reply_to: 'test@test.com',
    subject: 'Content report',
    html,
  };

  expect(req).toBe('sent');
  expect(mailClient.send).not.toHaveBeenCalledWith(payload);
  done();
});

test('use default values when the user is not authenticated', async (done) => {
  const data = { comments: 'message', editId: 'itemId' };
  const snap = { data: () => data };

  const wrapped = testEnv.wrap(onCreateReportSendEmail);
  const req = await wrapped(snap);

  const html = `
  <strong>Name:</strong> none <br />
  <strong>Email:</strong> none <br />
  <strong>UID:</strong> none <br />
  <strong>Edit:</strong> <a href="https://en.zoonk.org/edits/itemId">itemId</a> <br />
  <strong>Message:</strong> message
`;
  const payload = {
    to: supportEmail,
    from: supportEmail,
    reply_to: supportEmail,
    subject: 'Content report',
    html,
  };

  expect(req).toBe('sent');
  expect(mailClient.send).not.toHaveBeenCalledWith(payload);
  done();
});
