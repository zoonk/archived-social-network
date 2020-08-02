import * as functions from 'firebase-functions';
import fetch from 'node-fetch';
import { Topic } from '@zoonk/models';

/**
 * Call a topic page in the frontend to rebuild it (SSG).
 */
export const onUpdateTopicRebuildPage = functions.firestore
  .document('topics/{id}')
  .onUpdate((change) => {
    const { language } = change.after.data() as Topic.Response;
    const url = `https://${language}.zoonk.org/topics/${change.after.id}`;
    return fetch(url);
  });
