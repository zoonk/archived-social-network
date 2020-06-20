import { pick } from 'lodash';
import { Activity } from '@zoonk/models';
import { editableFields } from '@zoonk/utils';
import { serializeFirebaseDate } from './date';

export const serializeActivity = (
  snap: firebase.firestore.DocumentSnapshot<Activity.Response>,
): Activity.Get => {
  const data = snap.data()!;
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: '2-digit',
    hour: 'numeric',
    minute: 'numeric',
  };

  // Make sure only editable fields are sent back to the frontend.
  const before: any = pick(data.before, editableFields[data.category]);
  const after: any = pick(data.after, editableFields[data.category]);

  return {
    ...data,
    before,
    after,
    id: snap.id,
    updatedAt: serializeFirebaseDate(data.updatedAt, options),
  };
};
