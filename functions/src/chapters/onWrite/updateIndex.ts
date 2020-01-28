import * as functions from 'firebase-functions';
import { isEqual, pick } from 'lodash';
import { Chapter } from '@zoonk/models';
import { algoliaClient } from '../../algolia';

export const onWriteChapterUpdateIndex = functions.firestore
  .document('chapters/{id}')
  .onWrite((change, context) => {
    const { id } = context.params;
    const indexFields = ['description', 'photo', 'title'];
    const before = change.before.data() as Chapter.Response | undefined;
    const after = change.after.data() as Chapter.Response | undefined;
    const language = before?.language || after?.language || 'en';
    const index = algoliaClient.initIndex(`chapters_${language}`);
    const noChanges = isEqual(
      pick(before, indexFields),
      pick(after, indexFields),
    );

    if (noChanges) {
      return false;
    }

    if (!after) {
      return index.deleteObject(id);
    }

    const docIndex: Chapter.Index = {
      itemPath: `chapters/${id}`,
      objectID: id,
      description: after.description,
      pathId: after.pathId,
      photo: after.photo,
      title: after.title,
    };

    return index.partialUpdateObject(docIndex, true);
  });
