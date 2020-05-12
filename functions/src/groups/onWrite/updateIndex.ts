import * as functions from 'firebase-functions';
import { isEqual, pick } from 'lodash';
import { Group } from '@zoonk/models';
import { algoliaClient } from '../../algolia';

export const onWriteGroupUpdateIndex = functions.firestore
  .document('groups/{id}')
  .onWrite((change) => {
    const indexFields = ['description', 'photo', 'title'];
    const before = change.before.data() as Group.Response | undefined;
    const after = change.after.data() as Group.Response | undefined;
    const language = before?.language || after?.language || 'en';
    const index = algoliaClient.initIndex(`groups_${language}`);
    const noChanges = isEqual(
      pick(before, indexFields),
      pick(after, indexFields),
    );

    if (noChanges) {
      return false;
    }

    if (!after) {
      return index.deleteObject(change.before.id);
    }

    const groupIndex: Group.Index = {
      description: after.description,
      itemPath: `groups/${change.after.id}`,
      objectID: change.after.id,
      photo: after.photo,
      title: after.title,
    };

    return index.partialUpdateObject(groupIndex, { createIfNotExists: true });
  });
