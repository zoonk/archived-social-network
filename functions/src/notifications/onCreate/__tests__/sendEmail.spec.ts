import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';

const testEnv = functions();
testEnv.mockConfig({ sendgrid: { api_key: 'SG.random-key' } });
const db = admin.firestore();

import { commentsTemplate, contentTemplate, mailClient } from '../../../mail';
import { onCreateNotificationSendEmail } from '../sendEmail';

beforeAll(() => {
  spyOn(mailClient, 'send').and.returnValue('sent');
});

test('return when the user does not have an email address', async (done) => {
  const userData = {
    email: null,
    notificationSettings: { contentChanges: ['email'] },
    username: 'test',
  };
  const params = { userId: 'userId' };
  const data = { type: 'contentChanges' };
  const snap = { data: () => data };

  spyOn(db.doc(''), 'get').and.returnValue({ data: () => userData });

  const wrapped = testEnv.wrap(onCreateNotificationSendEmail);
  const req = await wrapped(snap, { params });

  expect(req).toBe(false);
  expect(db.doc).toHaveBeenCalledWith('users/userId');
  expect(mailClient.send).not.toHaveBeenCalled();
  done();
});

test('return when email notifications are not enabled', async (done) => {
  const userData = {
    email: 'test@test.com',
    notificationSettings: { contentChanges: ['app'] },
    username: 'test',
  };
  const params = { userId: 'userId' };
  const data = { type: 'contentChanges' };
  const snap = { data: () => data };

  spyOn(db.doc(''), 'get').and.returnValue({ data: () => userData });

  const wrapped = testEnv.wrap(onCreateNotificationSendEmail);
  const req = await wrapped(snap, { params });

  expect(req).toBe(false);
  expect(db.doc).toHaveBeenCalledWith('users/userId');
  expect(mailClient.send).not.toHaveBeenCalled();
  done();
});

test('send an email notification', async (done) => {
  const userData = {
    email: 'test@test.com',
    notificationSettings: { contentChanges: ['email'] },
    username: 'test',
  };
  const params = { userId: 'userId' };
  const data = {
    activityId: 'editId',
    language: 'pt',
    title: 'title',
    type: 'contentChanges',
    user: { name: 'name' },
  };
  const snap = { data: () => data };

  spyOn(db.doc(''), 'get').and.returnValue({ data: () => userData });

  const wrapped = testEnv.wrap(onCreateNotificationSendEmail);
  const req = await wrapped(snap, { params });
  const msg = {
    to: 'test@test.com',
    from: 'support@zoonk.org',
    templateId: contentTemplate.pt,
    dynamic_template_data: {
      editId: 'editId',
      name: 'name',
      title: 'title',
      username: 'test',
    },
  };

  expect(req).toBe('sent');
  expect(db.doc).toHaveBeenCalledWith('users/userId');
  expect(mailClient.send).toHaveBeenCalledWith(msg);
  done();
});

test('send an email notification using the comments template', async (done) => {
  const userData = {
    email: 'test@test.com',
    notificationSettings: { comments: ['email'] },
    username: 'test',
  };
  const params = { userId: 'userId' };
  const data = {
    activityId: null,
    category: 'comments',
    itemPath: 'comments/commentId',
    language: 'en',
    title: 'title',
    type: 'comments',
    user: { name: 'name' },
  };
  const snap = { data: () => data };

  spyOn(db.doc(''), 'get').and.returnValue({ data: () => userData });

  const wrapped = testEnv.wrap(onCreateNotificationSendEmail);
  const req = await wrapped(snap, { params });
  const msg = {
    to: 'test@test.com',
    from: 'support@zoonk.org',
    templateId: commentsTemplate.en,
    dynamic_template_data: {
      editId: 'comments/commentId',
      name: 'name',
      title: 'title',
      username: 'test',
    },
  };

  expect(req).toBe('sent');
  expect(db.doc).toHaveBeenCalledWith('users/userId');
  expect(mailClient.send).toHaveBeenCalledWith(msg);
  done();
});
