import * as functions from 'firebase-functions';
import { isEqual, pick } from 'lodash';
import { Path } from '@zoonk/models';
import { algoliaClient } from '../../algolia';

export const onWritePathUpdateIndex = functions.firestore
  .document('paths/{id}')
  .onWrite((change, context) => {
    const { id } = context.params;
    const indexFields = ['description', 'photo', 'title'];
    const before = change.before.data() as Path.Response | undefined;
    const after = change.after.data() as Path.Response | undefined;
    const language = before?.language || after?.language || 'en';
    const index = algoliaClient.initIndex(`paths_${language}`);
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

    const topicIndex: Path.Index = {
      itemPath: `paths/${id}`,
      objectID: id,
      description: after.description,
      photo: after.photo,
      title: after.title,
    };

    return index.partialUpdateObject(topicIndex, true);
  });
