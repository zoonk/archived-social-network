import * as functions from 'firebase-functions';
import { isEqual } from 'lodash';
import { Profile } from '@zoonk/models';

export const getProfileChanges = (
  change: functions.Change<FirebaseFirestore.DocumentSnapshot>,
): Partial<Profile.Update> | null => {
  const before = change.before.data() as Profile.Response;
  const after = change.after.data() as Profile.Response;

  if (isEqual(before, after)) {
    return null;
  }

  return after;
};
