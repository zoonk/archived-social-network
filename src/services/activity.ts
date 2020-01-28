import { pick } from 'lodash';
import { ContentMetadata, Activity, Profile } from '@zoonk/models';
import {
  appLanguage,
  db,
  editableFields,
  functions,
  getChangedFields,
  timestamp,
} from '@zoonk/utils';
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

/**
 * Get a list of activities from the database.
 */
export const listActivities = async (
  itemPath?: string,
  startAfter?: firebase.firestore.DocumentSnapshot,
  limit: number = 10,
): Promise<Activity.Snapshot[]> => {
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

  if (startAfter) {
    ref = ref.startAfter(startAfter);
  }

  const snap = await ref.get();
  return snap.docs.map((item) => {
    return { ...item.data(), snap: item };
  });
};

/**
 * Delete the document when reverting a recently created item.
 */
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

/**
 * Revert changes made to a document.
 */
export const revertChanges = (
  activity: Activity.Get,
  profile: Profile.Response,
  uid: string,
): Promise<void> => {
  const before: any = activity.action !== 'created' ? activity.before : {};
  const after: any = activity.action !== 'deleted' ? activity.after : {};

  // Get only editable fields.
  const beforeFields = pick(before, editableFields[activity.category]);
  const afterFields = pick(after, editableFields[activity.category]);

  /**
   * We don't want to overwrite all fields but revert only the fields
   * changed by this activity.
   */
  const changedFields = getChangedFields(beforeFields, afterFields);
  const metadata: ContentMetadata.Update = {
    updatedAt: timestamp,
    updatedBy: profile,
    updatedById: uid,
  };
  const changes: any = {
    ...metadata,
  };

  // Add only changed fields to the update action.
  changedFields.forEach((field) => {
    changes[field] = before[field];
  });

  return db.doc(activity.itemPath).set(changes, { merge: true });
};

/**
 * Restore a delete item.
 */
export const restoreItem = (
  activityId: string,
): Promise<firebase.functions.HttpsCallableResult> => {
  return functions.httpsCallable('restoreDeletedItem')({ id: activityId });
};
