import * as functions from 'firebase-functions';
import { isEqual, pick } from 'lodash';
import { Topic } from '@zoonk/models';
import { algoliaClient } from '../../algolia';

export const onWriteTopicUpdateIndex = functions.firestore
  .document('topics/{topicId}')
  .onWrite((change) => {
    const indexFields = ['description', 'photo', 'title'];
    const before = change.before.data() as Topic.Response | undefined;
    const after = change.after.data() as Topic.Response | undefined;
    const language = before?.language || after?.language || 'en';
    const index = algoliaClient.initIndex(`topics_${language}`);
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

    const topicIndex: Topic.Index = {
      itemPath: `topics/${change.after.id}`,
      objectID: change.after.id,
      title: after.title,
      description: after.description,
      photo: after.photo,
    };

    return index.partialUpdateObject(topicIndex, { createIfNotExists: true });
  });
