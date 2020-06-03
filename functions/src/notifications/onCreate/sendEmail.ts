import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Notification, User } from '@zoonk/models';
import { commentsTemplate, contentTemplate, mailClient } from '../../mail';

const db = admin.firestore();

export const onCreateNotificationSendEmail = functions.firestore
  .document('users/{userId}/notifications/{notId}')
  .onCreate(async (snap, context) => {
    const { userId } = context.params;
    const data = snap.data() as Notification.Response;
    const user = await db.doc(`users/${userId}`).get();
    const userData = user.data() as User.Response;

    const isEnabled = userData.notificationSettings[data.type].includes(
      'email',
    );

    // Return when a user disabled email notifications.
    if (!isEnabled || !userData.email) return false;

    const templateData: Notification.Email = {
      editId: data.activityId || data.itemPath,
      name: data.user.name,
      title: data.title,
      username: userData.username,
    };
    const templateId =
      data.category === 'comments' ? commentsTemplate : contentTemplate;

    const msg = {
      to: userData.email,
      from: 'support@zoonk.org',
      templateId: templateId[data.language],
      dynamic_template_data: templateData,
    };

    return mailClient.send(msg);
  });
