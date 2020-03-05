import * as functions from 'firebase-functions';
import { isEqual, pick } from 'lodash';
import { Chapter } from '@zoonk/models';
import { algoliaClient } from '../../algolia';

export const onWriteChapterUpdateIndex = functions.firestore
  .document('chapters/{id}')
  .onWrite((change, context) => {
    const { id } = context.params;
    const indexFields = ['description', 'title'];
    const before = change.before.data() as Chapter.Response | undefined;
    const after = change.after.data() as Chapter.Response | undefined;
    const language = before?.language || after?.language || 'en';
    const index = algoliaClient.initIndex(`chapters_${language}`);

    if (!after) {
      return index.deleteObject(id);
    }

    const noChanges = isEqual(
      pick(before, indexFields),
      pick(after, indexFields),
    );

    if (noChanges) {
      return false;
    }

    const indexData: Chapter.Index = {
      itemPath: `chapters/${id}`,
      objectID: id,
      title: after.title,
      description: after.description,
      topics: after.topics,
    };

    return index.partialUpdateObject(indexData, { createIfNotExists: true });
  });
