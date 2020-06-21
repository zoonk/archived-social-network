import functions from 'firebase-functions-test';

const testEnv = functions();
testEnv.mockConfig({ sendgrid: { api_key: 'SG.random-key' } });

import { mailClient } from '../../../mail';
import { supportEmail } from '../../../settings';
import { onCreateFeedbackSendEmail } from '../sendEmail';

beforeAll(() => {
  spyOn(mailClient, 'send').and.returnValue('sent');
});

test('send an email when a feedback is received', async (done) => {
  const data = {
    email: 'test@test.com',
    message: 'test message',
    name: 'test name',
    query: '{}',
    uid: 'user id',
  };
  const params = { userId: 'userId' };
  const snap = { data: () => data };

  const wrapped = testEnv.wrap(onCreateFeedbackSendEmail);
  const req = await wrapped(snap, { params });

  const html = `
    <strong>Name:</strong> test name <br />
    <strong>Email:</strong> test@test.com <br />
    <strong>UID:</strong> user id <br />
    <strong>Query:</strong> {} <br />
    <strong>Message:</strong> test message
  `;
  const payload = {
    to: supportEmail,
    from: supportEmail,
    reply_to: 'test@test.com',
    subject: 'Zoonk feedback',
    html,
  };

  expect(req).toBe('sent');
  expect(mailClient.send).not.toHaveBeenCalledWith(payload);
  done();
});

test('use the default email when no one is passed', async (done) => {
  const data = {
    message: 'test message',
    name: 'test name',
    query: '{}',
    uid: 'user id',
  };
  const params = { userId: 'userId' };
  const snap = { data: () => data };

  const wrapped = testEnv.wrap(onCreateFeedbackSendEmail);
  const req = await wrapped(snap, { params });

  const html = `
    <strong>Name:</strong> test name <br />
    <strong>Email:</strong> none <br />
    <strong>UID:</strong> user id <br />
    <strong>Query:</strong> {} <br />
    <strong>Message:</strong> test message
  `;
  const payload = {
    to: supportEmail,
    from: supportEmail,
    reply_to: supportEmail,
    subject: 'Zoonk feedback',
    html,
  };

  expect(req).toBe('sent');
  expect(mailClient.send).not.toHaveBeenCalledWith(payload);
  done();
});
