import * as functions from 'firebase-functions';
import { isEqual, pick } from 'lodash';
import { Post } from '@zoonk/models';
import { algoliaClient } from '../../algolia';

export const onWritePostUpdateIndex = functions.firestore
  .document('posts/{id}')
  .onWrite((change, context) => {
    const { id } = context.params;
    const indexFields = ['category', 'content', 'title'];
    const before = change.before.data() as Post.Response | undefined;
    const after = change.after.data() as Post.Response | undefined;
    const language = before?.language || after?.language || 'en';
    const index = algoliaClient.initIndex(`posts_${language}`);

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

    const indexData: Post.Index = {
      itemPath: `posts/${id}`,
      objectID: id,
      title: after.title,
      category: after.category,
      description: after.content.slice(0, 500),
      photo: null,
    };

    return index.partialUpdateObject(indexData, { createIfNotExists: true });
  });
