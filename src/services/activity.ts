import { pick } from 'lodash';
import { db, timestamp } from '@zoonk/firebase/db';
import { functions } from '@zoonk/firebase/functions';
import { ContentMetadata, Activity, Profile } from '@zoonk/models';
import { appLanguage, editableFields } from '@zoonk/utils';
import { serializeActivity } from '../serializers';

const activityConverter: firebase.firestore.FirestoreDataConverter<Activity.Get> = {
  toFirestore(data: any) {
    return data;
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot<Activity.Response>,
  ): Activity.Get {
    return serializeActivity(snapshot);
  },
};

const activitiesQuery = (
  limit = 10,
  itemPath?: string,
): firebase.firestore.Query<Activity.Get> => {
  let ref = db
    .collection('activity')
    .withConverter(activityConverter)
    .orderBy('updatedAt', 'desc')
    .limit(limit);

  if (itemPath) {
    ref = ref.where('itemPath', '==', itemPath);
  }

  if (!itemPath) {
    ref = ref.where('language', '==', appLanguage);
  }

  return ref;
};

export const getActivities = async (
  limit?: number,
  itemPath?: string,
): Promise<Activity.Get[]> => {
  const snap = await activitiesQuery(limit, itemPath).get();
  return snap.docs.map((doc) => doc.data());
};

export const getActivitiesSnapshot = async (
  limit: number,
  last: firebase.firestore.DocumentSnapshot,
  itemPath?: string,
): Promise<Activity.Snapshot[]> => {
  const ref = await activitiesQuery(limit, itemPath)
    .startAfter(last)
    .get();

  return ref.docs.map((snap) => ({ ...snap.data(), snap }));
};

export const getActivity = async (id: string): Promise<Activity.Get | null> => {
  const snap = await db
    .doc(`activity/${id}`)
    .withConverter(activityConverter)
    .get();

  return snap.data() || null;
};

export const deleteActivity = async (
  activity: Activity.Get,
  profile: Profile.Response,
  uid: string,
): Promise<void> => {
  // Update the user metadata before deleting it.
  const update: ContentMetadata.Update = {
    updatedAt: timestamp,
    updatedBy: profile,
    updatedById: uid,
  };

  const ref = db.doc(activity.itemPath);
  await ref.update(update);
  return ref.delete();
};

export const revertChanges = (
  activity: Activity.Get,
  profile: Profile.Response,
  uid: string,
): Promise<void> => {
  const before: any = activity.action !== 'created' ? activity.before : {};

  // Get only editable fields.
  const beforeFields = pick(before, editableFields[activity.category]);

  const metadata: ContentMetadata.Update = {
    updatedAt: timestamp,
    updatedBy: profile,
    updatedById: uid,
  };
  const changes: any = {
    ...beforeFields,
    ...metadata,
  };

  return db.doc(activity.itemPath).set(changes, { merge: true });
};

export const restoreItem = (
  activityId: string,
): Promise<firebase.functions.HttpsCallableResult> => {
  return functions.httpsCallable('restoreDeletedItem')({ id: activityId });
};
