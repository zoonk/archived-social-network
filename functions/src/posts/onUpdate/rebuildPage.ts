import * as functions from 'firebase-functions';
import fetch from 'node-fetch';
import { Post } from '@zoonk/models';

/**
 * Call a post page in the frontend to rebuild it (SSG).
 */
export const onUpdatePostRebuildPage = functions.firestore
  .document('posts/{id}')
  .onUpdate((change) => {
    const { language } = change.after.data() as Post.Response;
    const url = `https://${language}.zoonk.org/posts/${change.after.id}`;
    return fetch(url);
  });
