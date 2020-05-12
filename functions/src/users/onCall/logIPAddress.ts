import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

export const logIPAddress = functions.https.onCall(async (_, context) => {
  const uid = context.auth?.uid;
  const { ip, ips } = context.rawRequest as any;

  if (!uid) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'you need to be logged in.',
    );
  }

  const reqData = {
    ip,
    ips,
    visited: admin.firestore.FieldValue.serverTimestamp(),
  };
  const ref = await db.collection(`users/${uid}/ipAddress`).add(reqData);

  return { id: ref.id };
});
